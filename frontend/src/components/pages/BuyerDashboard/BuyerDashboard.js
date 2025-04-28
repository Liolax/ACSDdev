import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WishlistSection from './WishlistSection';         
import CartSection from './CartSection';                 
import FeedbackPopup from '../../ui/FeedbackPopup';      
import Button from '../../ui/Button';                    
import '../../../assets/styles/pages/_buyer-dashboard.scss'; 
import getImageUrl from '../../../helpers/getImageUrl';   

// Helper function to determine collage style for order images
const getCollageStyle = (count) => {
  let containerSize = 120;
  let gridTemplateColumns = '1fr';
  if (count === 1) gridTemplateColumns = '1fr';
  else if (count === 2) gridTemplateColumns = 'repeat(2, 1fr)';
  else if (count === 3 || count === 4) gridTemplateColumns = 'repeat(2, 1fr)';
  else gridTemplateColumns = 'repeat(3, 1fr)';
  return { containerSize, gridTemplateColumns };
};

const BuyerDashboard = () => {
  // Orders state (fetch from backend)
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Wishlist and Cart state
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlistVisible, setWishlistVisible] = useState(5);
  const [cartVisible, setCartVisible] = useState(5);

  // Feedback state keyed by order id
  const [feedbackByOrder, setFeedbackByOrder] = useState({});
  const [feedbackOrderId, setFeedbackOrderId] = useState(null);

  // Fetch orders, wishlist, and cart from backend
  useEffect(() => {
    axios.get('/api/orders')
      .then(res => {
        setOrders(res.data);
        setLoadingOrders(false);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setLoadingOrders(false);
      });
  }, []);

  useEffect(() => {
    axios.get('/api/wishlist')
      .then(res => setWishlist(res.data))
      .catch(err => {
        console.error("Error fetching wishlist:", err);
        setWishlist([]);
      });
    axios.get('/api/cart')
      .then(res => setCart(res.data))
      .catch(err => {
        console.error("Error fetching cart:", err);
        setCart([]);
      });
  }, []);

  // Wishlist Handlers.
  const handleRemoveWishlist = (id) => {
    axios.delete(`/api/wishlist/${id}`)
      .then(() => {
        setWishlist(prev => prev.filter(item => item._id !== id && item.id !== id));
      })
      .catch(err => console.error("Error removing wishlist item:", err));
  };

  const handleMoveToCart = (item) => {
    // For adding to cart, backend expects productId and quantity.
    const prodId = item.productId || item._id;
    axios.post('/api/cart', { productId: prodId, quantity: 1 })
      .then(() => {
        setWishlist(prev => prev.filter(w => (w._id || w.id) !== (item._id || item.id)));
        const existingCartItem = cart.find(c => (c._id || c.id) === (item._id || item.id));
        if (existingCartItem) {
          setCart(prev =>
            prev.map(c =>
              (c._id || c.id) === (item._id || item.id)
                ? { ...c, quantity: c.quantity + 1 }
                : c
            )
          );
        } else {
          setCart(prev => [...prev, { ...item, quantity: 1 }]);
        }
      })
      .catch(err => console.error("Error moving item to cart:", err));
  };

  const handleWishlistSeeLess = () => setWishlistVisible(5);

  // Cart Handlers.
  const handleRemoveCart = (id) => {
    axios.delete(`/api/cart/${id}`)
      .then(() => {
        setCart(prev => prev.filter(item => (item._id || item.id) !== id));
      })
      .catch(err => console.error("Error removing cart item:", err));
  };

  const handleCartSeeLess = () => setCartVisible(5);
  
  const handlePay = () => {
    alert('Proceed to payment and shipping selection.');
  };

  // Feedback Handlers.
  const handleFeedbackSubmit = (feedbackData) => {
    axios.patch(`/api/orders/${feedbackData.orderId}/feedback`, {
      rating: feedbackData.rating,
      title: feedbackData.title,
      comments: feedbackData.comments,
    })
      .then(() => {
        setFeedbackByOrder(prev => ({
          ...prev,
          [feedbackData.orderId]: { ...feedbackData, given: true }
        }));
      })
      .catch(err => console.error("Error submitting feedback:", err));
    setFeedbackOrderId(null);
  };

  const handleFeedbackDelete = (orderId) => {
    setFeedbackByOrder(prev => {
      const updated = { ...prev };
      delete updated[orderId];
      return updated;
    });
  };

  return (
    <div className="buyer-dashboard">
      <h2 className="buyer-dashboard__header">My Purchases</h2>
      <div className="buyer-dashboard__quick-links">
        <a href="#wishlist-section" className="buyer-dashboard__quick-link">❤️ Wishlist</a>
        <a href="#cart-section" className="buyer-dashboard__quick-link">🛒 Cart</a>
      </div>

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
                    gridTemplateColumns: gridTemplateColumns,
                  }}
                >
                  {order.items.map((item, idx) => (
                    <img
                      key={idx}
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="order-card__mini-image"
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

      <section className="buyer-dashboard__wishlist" id="wishlist-section">
        <h2 className="buyer-dashboard__section-header">Wishlist</h2>
        {wishlist.length === 0 ? (
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

      <section className="buyer-dashboard__cart" id="cart-section">
        <h2 className="buyer-dashboard__section-header">Cart</h2>
        {cart.length === 0 ? (
          <p className="buyer-dashboard__empty">Your cart is currently empty.</p>
        ) : (
          <CartSection
            items={cart}
            visibleCount={cartVisible}
            onSeeMore={() => setCartVisible(cartVisible + 5)}
            onSeeLess={cartVisible > 5 ? handleCartSeeLess : null}
            onRemove={handleRemoveCart}
            onPay={handlePay}
          />
        )}
      </section>

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
