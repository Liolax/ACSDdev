import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WishlistSection from './WishlistSection';
import CartSection from './CartSection';
import FeedbackPopup from '../../ui/FeedbackPopup';
import Button from '../../ui/Button';

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
  // Orders state (real API call)
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
      .catch(() => setLoadingOrders(false));
  }, []);

  useEffect(() => {
    axios.get('/api/wishlist')
      .then(res => setWishlist(res.data))
      .catch(() => setWishlist([]));
    axios.get('/api/cart')
      .then(res => setCart(res.data))
      .catch(() => setCart([]));
  }, []);

  // Wishlist Handlers.
  const handleRemoveWishlist = (id) => {
    axios.delete(`/api/wishlist/${id}`).then(() => {
      setWishlist(wishlist.filter(item => item.id !== id));
    });
  };

  const handleMoveToCart = (item) => {
    axios.post('/api/cart', { ...item, quantity: 1 }).then(() => {
      setWishlist(wishlist.filter(w => w.id !== item.id));
      const existingCart = cart.find(c => c.id === item.id);
      if (existingCart) {
        setCart(cart.map(c => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)));
      } else {
        setCart([...cart, { ...item, quantity: 1 }]);
      }
    });
  };

  const handleWishlistSeeLess = () => setWishlistVisible(5);

  // Cart Handlers.
  const handleRemoveCart = (id) => {
    axios.delete(`/api/cart/${id}`).then(() => {
      setCart(cart.filter(item => item.id !== id));
    });
  };

  const handleCartSeeLess = () => setCartVisible(5);
  
  const handlePay = () => {
    // Replace with proper payment and shipping flow.
    alert('Proceed to payment and shipping selection.');
  };

  // Feedback Handlers.
  const handleFeedbackSubmit = (feedbackData) => {
    axios.patch(`/api/orders/${feedbackData.orderId}/feedback`, {
      rating: feedbackData.rating,
      title: feedbackData.title,
      comments: feedbackData.comments,
    }).then(() => {
      setFeedbackByOrder(prev => ({
        ...prev,
        [feedbackData.orderId]: { ...feedbackData, given: true }
      }));
    });
    setFeedbackOrderId(null);
  };

  const handleFeedbackDelete = (orderId) => {
    setFeedbackByOrder(prev => {
      const newFeedback = { ...prev };
      delete newFeedback[orderId];
      return newFeedback;
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
          <p className="buyer-dashboard__empty">No orders found. Your past orders will appear here when available.</p>
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
                    <img key={idx} src={item.image} alt={item.name} className="order-card__mini-image" />
                  ))}
                </div>
                <div className="order-card__details">
                  <h3 className="order-card__id">Order {order._id}</h3>
                  <p className="order-card__items-names">{order.items.map(item => item.name).join(', ')}</p>
                  <p className="order-card__status">Status: {order.status}</p>
                  <p className="order-card__date">Date: {new Date(order.date).toLocaleDateString()}</p>
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

      {feedbackOrderId && (
        <FeedbackPopup
          orderId={feedbackOrderId}
          initialFeedback={feedbackByOrder[feedbackOrderId] || null}
          closePopup={() => setFeedbackOrderId(null)}
          onSubmitFeedback={handleFeedbackSubmit}
        />
      )}

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
    </div>
  );
};

export default BuyerDashboard;
