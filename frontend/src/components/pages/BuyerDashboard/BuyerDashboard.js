import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const BuyerDashboard = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [wishlistVisible, setWishlistVisible] = useState(5);
  const [cartVisible, setCartVisible] = useState(5);
  const [feedbackByOrder, setFeedbackByOrder] = useState({});
  const [feedbackOrderId, setFeedbackOrderId] = useState(null);

  const navigate = useNavigate();

// Fetch wishlist and cart on component mount
useEffect(() => {
  axios
    .get('/api/wishlist')
    .then((res) => {
      setWishlist(res.data.wishlist?.items || []);
    })
    .catch((err) => {
      console.error("Error fetching wishlist:", err);
      setWishlist([]);
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
const handleRemoveCart = (productId) => {
  removeFromCartApi(productId)
    .then((res) => setCart(res.cart))
    .catch((err) => console.error("Error removing cart item:", err));
};

const handleUpdateQuantity = (productId, newQuantity) => {
  updateCartItemQuantity(productId, newQuantity)
    .then((res) => setCart(res.cart))
    .catch((err) => console.error("Error updating cart item quantity:", err));
};

const handleCartSeeLess = () => setCartVisible(5);

// Redirect buyer to the checkout page on Pay
const handlePay = () => {
  navigate('/checkout');
};

// Feedback Handlers
const handleFeedbackSubmit = async (feedbackData) => {
  try {
    await submitFeedback(feedbackData);
    // Optionally update local state or refetch feedback/orders
  } catch (err) {
    // handle error
  }
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
                  {order.items.map((item, idx) => (
                    <span key={idx}>{item.name}{idx < order.items.length - 1 ? ', ' : ''}</span>
                  ))}
                </p>
                <p className="order-card__total">Total: ${order.total}</p>
                <p className="order-card__status">Status: {order.status}</p>
                {order.status === 'delivered' && (
                  <Button
                    className="order-card__feedback-button"
                    onClick={() => setFeedbackOrderId(order._id)}
                  >
                    Leave Feedback
                  </Button>
                )}
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
      {cart.items.length > 0 ? (
        <CartSection
          cart={cart}
          handleRemoveCart={handleRemoveCart}
          handleUpdateQuantity={handleUpdateQuantity}
          visibleItems={cartVisible}
          handleSeeLess={handleCartSeeLess}
          handlePay={handlePay}
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
        closePopup={() => setFeedbackOrderId(null)}
        onSubmitFeedback={handleFeedbackSubmit}
      />
    )}
  </div>
);
};

export default BuyerDashboard;
