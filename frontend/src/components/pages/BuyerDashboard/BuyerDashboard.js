import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WishlistSection from './WishlistSection'; // Adjust if needed
import CartSection from './CartSection';
import FeedbackPopup from '../../ui/FeedbackPopup';
import Button from '../../ui/Button';
import '../../../assets/styles/pages/_buyer-dashboard.scss';
import getImageUrl from '../../../helpers/getImageUrl';
import { moveWishlistItemToCart, removeFromWishlist } from '../../../api/wishlist/wishlistRequests';
import { updateCartItemQuantity, removeFromCart as removeFromCartApi } from '../../../api/cart/cartRequests';

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

const BuyerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [wishlist, setWishlist] = useState(null);
  const [cart, setCart] = useState({ items: [] });
  const [wishlistVisible, setWishlistVisible] = useState(5);
  const [cartVisible, setCartVisible] = useState(5);
  const [feedbackByOrder, setFeedbackByOrder] = useState({});
  const [feedbackOrderId, setFeedbackOrderId] = useState(null);

  const navigate = useNavigate();

  // Fetch orders on component mount
  useEffect(() => {
    axios
      .get('/api/orders')
      .then((res) => {
        // If the response includes an 'orders' field, use that; otherwise, assume res.data is the orders array.
        const ordersData = res.data.orders ? res.data.orders : res.data;
        setOrders(ordersData);
        setLoadingOrders(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setOrders([]);
        setLoadingOrders(false);
      });
  }, []);

  // Fetch wishlist and cart on component mount
  useEffect(() => {
    axios
      .get('/api/wishlist')
      .then((res) => {
        setWishlist(res.data.wishlist);
      })
      .catch((err) => {
        console.error("Error fetching wishlist:", err);
        setWishlist(null);
      });

    axios
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
      axios
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

  // Wishlist Handlers
  const handleRemoveWishlist = (productId) => {
    removeFromWishlist(productId)
      .then((res) => setWishlist(res.wishlist))
      .catch((err) => console.error("Error removing wishlist item:", err));
  };

  const handleMoveToCart = (productId) => {
    moveWishlistItemToCart(productId)
      .then((res) => {
        setWishlist(res.wishlist);
        setCart(res.cart);
      })
      .catch((err) => console.error("Error moving item to cart:", err));
  };

  const handleWishlistSeeLess = () => setWishlistVisible(5);

  // Cart Handlers
  const handleRemoveCart = (productId) => {
    removeFromCartApi(productId)
      .then((res) => setCart(res.cart))
      .catch((err) => console.error("Error removing cart item:", err));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(productId, newQuantity)
      .then((res) => setCart(res.cart))
      .catch((err) => console.error("Error updating cart quantity:", err));
  };

  const handleCartSeeLess = () => setCartVisible(5);

  // Redirect buyer to the checkout page on Pay
  const handlePay = () => {
    navigate('/checkout');
  };

  // Feedback Handlers
  const handleFeedbackSubmit = (feedbackData) => {
    axios
      .patch(`/api/orders/${feedbackData.orderId}/feedback`, {
        rating: feedbackData.rating,
        title: feedbackData.title,
        comments: feedbackData.comments,
      })
      .then(() => {
        setFeedbackByOrder((prev) => ({
          ...prev,
          [feedbackData.orderId]: { ...feedbackData, given: true }
        }));
      })
      .catch((err) => console.error("Error submitting feedback:", err));
    setFeedbackOrderId(null);
  };

  const handleFeedbackDelete = (orderId) => {
    console.log(`Deleting feedback for order ${orderId}`);
    setFeedbackByOrder((prev) => {
      const updated = { ...prev };
      delete updated[orderId];
      return updated;
    });
  };

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
          orders.map(order => {
            const { containerSize, gridTemplateColumns } = getCollageStyle(order.items.length);
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
                  {order.items.map((item, idx) => (
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
                  <p className="order-card__items-names">
                    {order.items.map(item => item.name).join(', ')}
                  </p>
                  <p className="order-card__status">Status: {order.status}</p>
                  <p className="order-card__date">
                    Date: {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-card__actions">
                  <Button className="button--sm" onClick={() => alert(`Tracking order ${order._id}`)}>
                    Track Order
                  </Button>
                  {order.status === 'Delivered' && (
                    <>
                      {feedbackByOrder[order._id] ? (
                        <>
                          <Button className="button--sm" onClick={() => setFeedbackOrderId(order._id)}>
                            Edit Feedback
                          </Button>
                          <Button className="button--sm" onClick={() => handleFeedbackDelete(order._id)}>
                            Delete Feedback
                          </Button>
                        </>
                      ) : (
                        <Button className="button--sm button--green" onClick={() => setFeedbackOrderId(order._id)}>
                          Give Feedback
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Wishlist Section */}
      <section className="buyer-dashboard__wishlist" id="wishlist-section">
        <h2 className="buyer-dashboard__section-header">Wishlist</h2>
        {(!wishlist || !wishlist.items || wishlist.items.length === 0) ? (
          <p className="buyer-dashboard__empty">Your wishlist is currently empty.</p>
        ) : (
          <WishlistSection
            items={wishlist}
            visibleCount={wishlistVisible}
            onSeeMore={() => setWishlistVisible(wishlistVisible + 5)}
            onSeeLess={wishlistVisible > 5 ? handleWishlistSeeLess : null}
            onRemove={handleRemoveWishlist}
            onMoveToCart={handleMoveToCart}
          />
        )}
      </section>

      {/* Cart Section */}
      <section className="buyer-dashboard__cart" id="cart-section">
        <h2 className="buyer-dashboard__section-header">Cart</h2>
        {cart.items.length === 0 ? (
          <p className="buyer-dashboard__empty">Your cart is currently empty.</p>
        ) : (
          <CartSection
            items={cart}
            visibleCount={cartVisible}
            onSeeMore={() => setCartVisible(cartVisible + 5)}
            onSeeLess={cartVisible > 5 ? handleCartSeeLess : null}
            onRemove={handleRemoveCart}
            onUpdateQuantity={handleUpdateQuantity}
            onPay={handlePay}
          />
        )}
      </section>

      {/* Feedback Popup */}
      {feedbackOrderId && (
        <FeedbackPopup
          orderId={feedbackOrderId}
          initialFeedback={feedbackByOrder[feedbackOrderId] || null}
          closePopup={() => setFeedbackOrderId(null)}
          onSubmitFeedback={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default BuyerDashboard;
