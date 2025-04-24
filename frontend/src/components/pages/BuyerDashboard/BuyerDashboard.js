import React, { useState, useEffect } from 'react';
import WishlistSection from './WishlistSection';
import CartSection from './CartSection';
import FeedbackPopup from '../../ui/FeedbackPopup';

// Helper to determine collage container size and grid layout based on item count
const getCollageStyle = (count) => {
  let containerSize = 120;
  let gridTemplateColumns = '1fr'; // default for 1 item
  if (count === 1) {
    gridTemplateColumns = '1fr';
  } else if (count === 2) {
    gridTemplateColumns = 'repeat(2, 1fr)';
  } else if (count === 3 || count === 4) {
    gridTemplateColumns = 'repeat(2, 1fr)';
  } else {
    gridTemplateColumns = 'repeat(3, 1fr)';
  }
  return { containerSize, gridTemplateColumns };
};

const BuyerDashboard = () => {
  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  // Feedback state: key = order id, value = feedback data
  const [feedbackByOrder, setFeedbackByOrder] = useState({});
  const [feedbackOrderId, setFeedbackOrderId] = useState(null);

  // Wishlist and Cart state
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlistVisible, setWishlistVisible] = useState(5);
  const [cartVisible, setCartVisible] = useState(5);

  // Dummy orders data
  useEffect(() => {
    const dummyOrders = [
      {
        id: 'A1001',
        status: 'Shipped',
        date: '2023-05-01',
        items: [
          { name: 'Handwoven Basket', image: 'https://picsum.photos/100/100?random=11' },
          { name: 'Handwoven Rug', image: 'https://picsum.photos/100/100?random=21' }
        ]
      },
      {
        id: 'A1002',
        status: 'Delivered',
        date: '2023-04-25',
        items: [
          { name: 'Artisan Vase', image: 'https://picsum.photos/100/100?random=12' }
        ]
      },
      {
        id: 'A1003',
        status: 'Processing',
        date: '2023-05-03',
        items: [
          { name: 'Bog Oak Bowl', image: 'https://picsum.photos/100/100?random=13' },
          { name: 'Antique Plate', image: 'https://picsum.photos/100/100?random=14' },
          { name: 'Nonewooden Spoon', image: 'https://picsum.photos/100/100?random=15' }
        ]
      }
    ];
    setOrders(dummyOrders);
    setLoadingOrders(false);
  }, []);

  // Dummy wishlist and cart data setup
  useEffect(() => {
    const dummyWishlist = Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1,
      name: `Wishlist Item ${index + 1}`,
      price: parseFloat((Math.random() * 50).toFixed(2)),
      image: `https://picsum.photos/300/200?random=${index + 101}`
    }));
    const dummyCart = Array.from({ length: 8 }).map((_, index) => ({
      id: index + 1,
      name: `Cart Item ${index + 1}`,
      price: parseFloat((Math.random() * 75).toFixed(2)),
      quantity: Math.floor(Math.random() * 3) + 1,
      image: `https://picsum.photos/300/200?random=${index + 201}`
    }));
    setWishlist(dummyWishlist);
    setCart(dummyCart);
  }, []);

  // Wishlist handlers
  const handleRemoveWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const handleMoveToCart = (item) => {
    setWishlist(wishlist.filter((w) => w.id !== item.id));
    const existingCartItem = cart.find((c) => c.id === item.id);
    if (existingCartItem) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleWishlistSeeLess = () => setWishlistVisible(5);

  // Cart handlers
  const handleRemoveCart = (id) => setCart(cart.filter((item) => item.id !== id));
  const handleCartSeeLess = () => setCartVisible(5);
  const handlePay = () => alert('Proceed to payment and shipping selection.');

  // Feedback handlers
  const handleFeedbackSubmit = (feedbackData) => {
    console.log('Feedback submitted for order', feedbackData.orderId, feedbackData);
    setFeedbackByOrder((prev) => ({ ...prev, [feedbackData.orderId]: feedbackData }));
    setFeedbackOrderId(null);
  };

  const handleFeedbackDelete = (orderId) => {
    setFeedbackByOrder((prev) => {
      const newFeedback = { ...prev };
      delete newFeedback[orderId];
      return newFeedback;
    });
  };

  return (
    <div className="buyer-dashboard">
      <h2 className="buyer-dashboard__header">My Purchases</h2>

      {/* Quick Links */}
      <div className="buyer-dashboard__quick-links">
        <a href="#wishlist-section" className="buyer-dashboard__quick-link">❤️ Wishlist</a>
        <a href="#cart-section" className="buyer-dashboard__quick-link">🛒 Cart</a>
      </div>

      {/* Orders Section */}
      <div className="buyer-dashboard__orders">
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : (
          orders.map((order) => {
            const { containerSize, gridTemplateColumns } = getCollageStyle(order.items.length);
            return (
              <div key={order.id} className="order-card">
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
                      src={item.image}
                      alt={item.name}
                      className="order-card__mini-image"
                    />
                  ))}
                </div>
                <div className="order-card__details">
                  <h3 className="order-card__id">Order {order.id}</h3>
                  <p className="order-card__items-names">{order.items.map(item => item.name).join(', ')}</p>
                  <p className="order-card__status">Status: {order.status}</p>
                  <p className="order-card__date">Date: {order.date}</p>
                </div>
                <div className="order-card__actions">
                  <button
                    className="button order-card__track"
                    onClick={() => alert(`Tracking order ${order.id}`)}
                  >
                    Track Order
                  </button>
                  {order.status === 'Delivered' && (
                    <>
                      {feedbackByOrder[order.id] ? (
                        <>
                          <button
                            className="button order-card__feedback"
                            onClick={() => setFeedbackOrderId(order.id)}
                          >
                            Edit Feedback
                          </button>
                          <button
                            className="button order-card__feedback"
                            onClick={() => handleFeedbackDelete(order.id)}
                          >
                            Delete Feedback
                          </button>
                        </>
                      ) : (
                        <button
                          className="button order-card__feedback"
                          onClick={() => setFeedbackOrderId(order.id)}
                        >
                          Give Feedback
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Feedback Popup */}
      {feedbackOrderId && (
        <FeedbackPopup
          orderId={feedbackOrderId}
          initialFeedback={feedbackByOrder[feedbackOrderId] || null}
          closePopup={() => setFeedbackOrderId(null)}
          onSubmitFeedback={handleFeedbackSubmit}
        />
      )}

      {/* Wishlist Section */}
      <section className="buyer-dashboard__wishlist" id="wishlist-section">
        <h2 className="buyer-dashboard__section-header">Wishlist</h2>
        <WishlistSection
          items={wishlist}
          visibleCount={wishlistVisible}
          onSeeMore={() => setWishlistVisible(wishlistVisible + 5)}
          onSeeLess={wishlistVisible > 5 ? handleWishlistSeeLess : null}
          onRemove={handleRemoveWishlist}
          onMoveToCart={handleMoveToCart}
        />
      </section>

      {/* Cart Section */}
      <section className="buyer-dashboard__cart" id="cart-section">
        <h2 className="buyer-dashboard__section-header">Cart</h2>
        <CartSection
          items={cart}
          visibleCount={cartVisible}
          onSeeMore={() => setCartVisible(cartVisible + 5)}
          onSeeLess={cartVisible > 5 ? handleCartSeeLess : null}
          onRemove={handleRemoveCart}
          onPay={handlePay}
        />
      </section>
    </div>
  );
};

export default BuyerDashboard;
