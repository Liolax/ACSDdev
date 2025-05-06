import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import WishlistSection from './WishlistSection'; 
import CartSection from './CartSection';
import FeedbackPopup from '../../ui/FeedbackPopup';
import Button from '../../ui/Button';
import '../../../assets/styles/pages/_buyer-dashboard.scss';
import getImageUrl from '../../../helpers/getImageUrl';
import { moveWishlistToCart, removeFromWishlist } from '../../../api/wishlist/wishlistRequests';
import { updateCartItemQuantity, removeFromCart as removeFromCartApi } from '../../../api/cart/cartRequests';
import { submitFeedback } from '../../../api/feedback/feedbackRequests';
import { markDelivered, getMyPurchases, addFeedback, editFeedback, deleteFeedback } from '../../../api/orders/ordersRequests';

// Helper function to determine collage style based on item count
const getCollageStyle = (count) => {
  let containerSize = 120; // Base size
  let gridTemplateColumns = '1fr'; // Default for 1 item

  if (count === 1) {
    gridTemplateColumns = '1fr';
  } else if (count === 2) {
    gridTemplateColumns = 'repeat(2, 1fr)';
  } else if (count === 3 || count === 4) {
    gridTemplateColumns = 'repeat(2, 1fr)'; // 2x2 grid for 3 or 4 items
  } else {
    gridTemplateColumns = 'repeat(3, 1fr)'; // 3 columns for 5+ items
  }
  return { containerSize, gridTemplateColumns };
};

const calculateTotal = (items) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => {
    const priceAsNumber = parseFloat(item.price);
    const quantityAsNumber = Number(item.quantity);
    if (!isNaN(priceAsNumber) && !isNaN(quantityAsNumber)) {
      return sum + (priceAsNumber * quantityAsNumber);
    } else {
      console.error("Error calculating total for item:", item);
      return sum;
    }
  }, 0);
};

const BuyerDashboard = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [wishlistVisible, setWishlistVisible] = useState(5);
  const [cartVisible, setCartVisible] = useState(5);
  const [feedbackByOrder, setFeedbackByOrder] = useState({});
  const [feedbackOrderId, setFeedbackOrderId] = useState(null);
  const [editFeedbackData, setEditFeedbackData] = useState(null);

  const navigate = useNavigate();

// Fetch wishlist and cart on component mount
useEffect(() => {
  apiClient
    .get('/api/wishlist')
    .then((res) => {
      setWishlist(res.data.wishlist?.items || []);
    })
    .catch((err) => {
      console.error("Error fetching wishlist:", err);
      setWishlist([]);
    });

  apiClient
    .get('/api/cart')
    .then((res) => {
      setCart(res.data.cart || { items: [] });
    })
    .catch((err) => {
      console.error("Error fetching cart:", err);
      setCart({ items: [] });
    });
}, []);

// Re-fetch the cart when the window regains focus
useEffect(() => {
  const fetchCart = () => {
    apiClient
      .get('/api/cart')
      .then((res) => setCart(res.data.cart || { items: [] }))
      .catch((err) => {
        console.error("Error fetching cart:", err);
        setCart({ items: [] });
      });
  };
  window.addEventListener('focus', fetchCart);
  return () => window.removeEventListener('focus', fetchCart);
}, []);

// Fetch orders on component mount
useEffect(() => {
  setLoadingOrders(true);
  getMyPurchases()
    .then((orders) => {
      setOrders(Array.isArray(orders) ? orders : []);
    })
    .catch((err) => {
      console.error("Error fetching orders:", err);
      setOrders([]);
    })
    .finally(() => setLoadingOrders(false));
}, []);

// Wishlist Handlers
const handleRemoveWishlist = (productId) => {
  removeFromWishlist(productId)
    .then((res) => setWishlist(res.wishlist?.items || []))
    .catch((err) => console.error("Error removing wishlist item:", err));
};

const handleMoveToCart = (productId) => {
  moveWishlistToCart(productId)
    .then((res) => {
      setWishlist(res.wishlist?.items || []);
      setCart(res.cart);
    })
    .catch((err) => console.error("Error moving item to cart:", err));
};

const handleWishlistSeeLess = () => setWishlistVisible(5);

// Cart Handlers
const handleRemoveCart = async (productId) => {
  try {
    const updatedCart = await removeFromCartApi(productId);
    setCart(updatedCart);
  } catch (err) {
    console.error("Error removing cart item:", err);
  }
};

const handleUpdateQuantity = async (productId, newQuantity) => {
  try {
    const updatedCart = await updateCartItemQuantity(productId, newQuantity);
    setCart(updatedCart);
  } catch (err) {
    console.error("Error updating cart item quantity:", err);
  }
}

const handleCartSeeLess = () => setCartVisible(5);

// Redirect buyer to the checkout page on Pay
const handlePay = () => {
  navigate('/checkout');
};

// Feedback Handlers
const handleFeedbackSubmit = async ({ orderId, itemId, rating, title, comments }) => {
  try {
    if (editFeedbackData) {
      await editFeedback(orderId, itemId, rating, title, comments);
    } else {
      await addFeedback(orderId, itemId, rating, title, comments);
    }
    setOrders(orders =>
      orders.map(order =>
        order._id === orderId
          ? {
              ...order,
              orderItems: order.orderItems.map(item =>
                item._id === itemId
                  ? { ...item, feedback: { rating, title, comments, edited: !!editFeedbackData } }
                  : item
              )
            }
          : order
      )
    );
  } catch (err) {
    // handle error
  }
  setFeedbackOrderId(null);
  setEditFeedbackData(null);
};

const handleEditFeedback = (orderId, itemId, feedback) => {
  setFeedbackOrderId({ orderId, itemId });
  setEditFeedbackData({ ...feedback });
};

const handleDeleteFeedback = async (orderId, itemId) => {
  try {
    await deleteFeedback(orderId, itemId);
    setOrders(orders =>
      orders.map(order =>
        order._id === orderId
          ? {
              ...order,
              orderItems: order.orderItems.map(item =>
                item._id === itemId ? { ...item, feedback: null } : item
              )
            }
          : order
      )
    );
  } catch (err) {
    // handle error
  }
};

const handleMarkDelivered = async (orderId, itemId) => {
  try {
    await markDelivered(orderId, itemId);
    setOrders(orders =>
      orders.map(order =>
        order._id === orderId
          ? {
              ...order,
              orderItems: order.orderItems.map(item =>
                item._id === itemId ? { ...item, status: 'Delivered' } : item
              )
            }
          : order
      )
    );
  } catch (err) {
    // Optionally show error to user
    console.error("Failed to mark as delivered", err);
  }
};

// To check if a product is related to an itemId:
const isProductRelatedToItem = (order, itemId, productId) => {
  const item = order.orderItems.find(i => i._id === itemId || i._id?.toString() === itemId?.toString());
  return item && item.productId && item.productId.toString() === productId.toString();
};

// Defensive: fallback to empty array if cart or cart.items is undefined
const cartItems = (cart && Array.isArray(cart.items)) ? cart.items : [];

return (
  <div className="buyer-dashboard">
    <h2 className="buyer-dashboard__header">My Purchases</h2>

    {/* Quick links for navigation */}
    <div className="buyer-dashboard__quick-links">
      <a href="#wishlist-section" className="buyer-dashboard__quick-link">❤️ Wishlist</a>
      <a href="#cart-section" className="buyer-dashboard__quick-link">🛒 Cart</a>
    </div>

    {/* Orders Section */}
    <div className="buyer-dashboard__orders">
      {loadingOrders ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="buyer-dashboard__empty">
          No orders found. Your past orders will appear here when available.
        </p>
      ) : (
        // Patch orders to always have .items and .total for rendering
        orders.map(order => {
          const items = order.orderItems || [];
          const total =
            (order.total !== undefined
              ? order.total
              : order.totalPrice?.$numberDecimal
                ? Number(order.totalPrice.$numberDecimal)
                : order.totalPrice !== undefined
                  ? Number(order.totalPrice)
                  : 0);

          const { containerSize, gridTemplateColumns } = getCollageStyle(items.length);
          return (
            <div key={order._id} className="order-card">
              <div
                className="order-card__collage"
                style={{
                  width: `${containerSize}px`,
                  height: `${containerSize}px`,
                  display: 'grid',
                  gridTemplateColumns,
                  gap: '2px',
                  overflow: 'hidden',
                  borderRadius: '8px',
                }}
              >
                {items.map((item, idx) => (
                  <img
                    key={idx}
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="order-card__mini-image"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/images/default-product.png';
                    }}
                  />
                ))}
              </div>
              <div className="order-card__details">
                <h3 className="order-card__id">Order {order._id}</h3>
                {items.map((item, idx) => {
                  // Progress bar logic
                  let progressPercent = 0;
                  let isDelivered = item.status === 'Delivered';
                  if (item.status === 'Processing') progressPercent = 33;
                  else if (item.status === 'Shipped') progressPercent = 66;
                  else if (item.status === 'Delivered') progressPercent = 100;

                  return (
                    <div
                      key={item._id || idx}
                      className={`order-card__item${isDelivered ? ' is-delivered' : ''}`}
                      style={{ display: 'flex', flexDirection: 'column', gap: '0.5em', flexWrap: 'wrap' }}
                    >
                      <div className="order-card__item-info">
                        <span className="order-card__item-name">{item.name}</span>
                        {/* Optionally show status text */}
                        {/* <span className="order-card__item-status-text">Status: {item.status}</span> */}
                      </div>
                      {/* Progress Bar */}
                      <div className="order-card__item-progress-container">
                        <div
                          className="order-card__item-progress-fill"
                          style={{
                            width: isDelivered ? '100%' : `${progressPercent}%`,
                            backgroundColor: isDelivered ? '#28a745' : '#eab308'
                          }}
                        ></div>
                      </div>
                      <div className="order-card__item-actions">
                        {item.status === 'Shipped' && (
                          <Button onClick={() => handleMarkDelivered(order._id, item._id)}>
                            Mark Delivered
                          </Button>
                        )}
                        {isDelivered && !item.feedback && (
                          <Button
                            className="buyer-dashboard__button--feedback"
                            style={{
                              padding: '0.32em 0.9em',
                              fontSize: '0.95rem',
                              borderRadius: '6px',
                              border: '2px solid #1caf68',
                              background: 'linear-gradient(90deg, #ffe066 0%, #ffd700 60%, #ffbe0b 100%)',
                              color: '#177e48',
                              marginRight: '0.3em',
                              marginBottom: '0.2em',
                              boxShadow: '0 1.5px 6px 0 rgba(23, 126, 72, 0.10)',
                              letterSpacing: '0.01em',
                              fontWeight: 600,
                              transition: 'background 0.16s, color 0.16s, box-shadow 0.16s, border-color 0.16s, transform 0.12s'
                            }}
                            onMouseOver={e => {
                              e.currentTarget.style.background = 'linear-gradient(90deg, #ffbe0b 0%, #ffd700 60%, #ffe066 100%)';
                              e.currentTarget.style.color = '#1caf68';
                              e.currentTarget.style.borderColor = '#177e48';
                              e.currentTarget.style.boxShadow = '0 4px 18px 0 rgba(23, 126, 72, 0.14)';
                              e.currentTarget.style.transform = 'scale(1.06) rotate(-1deg)';
                            }}
                            onMouseOut={e => {
                              e.currentTarget.style.background = 'linear-gradient(90deg, #ffe066 0%, #ffd700 60%, #ffbe0b 100%)';
                              e.currentTarget.style.color = '#177e48';
                              e.currentTarget.style.borderColor = '#1caf68';
                              e.currentTarget.style.boxShadow = '0 1.5px 6px 0 rgba(23, 126, 72, 0.10)';
                              e.currentTarget.style.transform = 'none';
                            }}
                            onClick={() => {
                              setFeedbackOrderId({ orderId: order._id, itemId: item._id });
                              setEditFeedbackData(null);
                            }}
                          >
                            Leave Feedback
                          </Button>
                        )}
                      </div>
                      {item.feedback && (
                        <>
                          <div className="order-card__item-feedback-display">
                            <span>
                              Feedback: {item.feedback.rating}★ {item.feedback.title}
                            </span>
                            <span style={{ display: 'inline-block', marginLeft: 8 }}>
                              {item.feedback.comments}
                              {item.feedback.edited && <span style={{ color: '#bfa800', marginLeft: 8 }}> (Edited)</span>}
                            </span>
                          </div>
                          {/* Edit/Delete buttons below feedback, with mobile-friendly layout */}
                          <div className="order-card__item-actions order-card__item-actions--feedback">
                            <Button
                              className="buyer-dashboard__button--feedback buyer-dashboard__button--edit"
                              style={{ background: '#ffe066', color: '#177e48', border: '2px solid #1caf68' }}
                              onClick={() => handleEditFeedback(order._id, item._id, item.feedback)}
                            >
                              Edit
                            </Button>
                            <span style={{ flex: 1 }} />
                            <Button
                              className="buyer-dashboard__button--feedback buyer-dashboard__button--delete"
                              style={{ background: '#fff3f3', color: '#b10e0e', border: '2px solid #b10e0e' }}
                              onClick={() => handleDeleteFeedback(order._id, item._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
                {/* NEW: Wrap total and status */}
                <div className="order-card__summary">
                  <p className="order-card__total">
                    Total: ${Number(total).toFixed(2)}
                  </p>
                  <p className="order-card__status">Status: {order.status}</p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>

    {/* Wishlist Section */}
    <div id="wishlist-section" className="buyer-dashboard__wishlist">
      <h2 className="buyer-dashboard__header">Wishlist</h2>
      {wishlist && wishlist.length > 0 ? (
        <WishlistSection
          wishlist={wishlist}
          handleRemoveWishlist={handleRemoveWishlist}
          handleMoveToCart={handleMoveToCart}
          visibleItems={wishlistVisible}
          handleSeeLess={handleWishlistSeeLess}
        />
      ) : (
        <p className="buyer-dashboard__empty">
          No items in wishlist. Add some products to your wishlist to see them here.
        </p>
      )}
    </div>

    {/* Cart Section */}
    <div id="cart-section" className="buyer-dashboard__cart">
      <h2 className="buyer-dashboard__header">Cart</h2>
      {cartItems.length > 0 ? (
        <CartSection
          items={cartItems}
          visibleCount={cartVisible}
          onSeeLess={handleCartSeeLess}
          onSeeMore={() => setCartVisible(cartVisible + 5)}
          onRemove={handleRemoveCart}
          onUpdateQuantity={handleUpdateQuantity}
          onPay={handlePay}
        />
      ) : (
        <p className="buyer-dashboard__empty">
          No items in cart. Add some products to your cart to see them here.
        </p>
      )}
    </div>

    {feedbackOrderId && (
      <FeedbackPopup
        orderId={feedbackOrderId}
        userId={user?._id}
        closePopup={() => {
          setFeedbackOrderId(null);
          setEditFeedbackData(null);
        }}
        onSubmitFeedback={handleFeedbackSubmit}
        initialFeedback={editFeedbackData}
      />
    )}
  </div>
);
};

export default BuyerDashboard;
