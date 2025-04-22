import React, { useState, useEffect } from 'react';
import WishlistSection from './WishlistSection';
import CartSection from './CartSection';

// Helper to determine collage container size and grid layout based on item count
const getCollageStyle = (count) => {
  let containerSize, gridTemplateColumns;
  // Example logic: adjust container size and layout based on count
  if (count === 1) {
    containerSize = 120;
    gridTemplateColumns = '1fr';
  } else if (count === 2) {
    containerSize = 120;
    gridTemplateColumns = 'repeat(2, 1fr)';
  } else if (count === 3 || count === 4) {
    containerSize = 120;
    gridTemplateColumns = 'repeat(2, 1fr)';
  } else {
    // For more than 4 items, use a 3-column grid
    containerSize = 120;
    gridTemplateColumns = 'repeat(3, 1fr)';
  }
  return { containerSize, gridTemplateColumns };
};

const BuyerDashboard = () => {
  // Orders state for "My Purchases"
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Dummy order data updated to support multiple items per order
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

  // Wishlist and Cart state (dummy data simulation)
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlistVisible, setWishlistVisible] = useState(5);
  const [cartVisible, setCartVisible] = useState(5);

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

  // Wishlist handlers – including "Move to Cart"
  const handleRemoveWishlist = (id) => setWishlist(wishlist.filter(item => item.id !== id));
  const handleMoveToCart = (item) => {
    setWishlist(wishlist.filter(w => w.id !== item.id));
    const existingCartItem = cart.find(c => c.id === item.id);
    if (existingCartItem) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Cart handlers
  const handleRemoveCart = (id) => setCart(cart.filter(item => item.id !== id));
  const handlePay = () => alert('Proceed to payment and shipping selection.');
  const handleWishlistSeeLess = () => setWishlistVisible(5);
  const handleCartSeeLess = () => setCartVisible(5);

  return (
    <div className="buyer-dashboard">
      <h2 className="buyer-dashboard__header">My Purchases</h2>
      
      {/* Quick Links: Wishlist and Cart icons with links */}
      <div className="buyer-dashboard__quick-links">
        <a href="#wishlist-section" className="buyer-dashboard__quick-link">❤️ Wishlist</a>
        <a href="#cart-section" className="buyer-dashboard__quick-link">🛒 Cart</a>
      </div>

      {/* Render orders with a refined collage style */}
      <div className="buyer-dashboard__orders">
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : (
          orders.map(order => {
            const { containerSize, gridTemplateColumns } = getCollageStyle(order.items.length);
            return (
              <div key={order.id} className="order-card">
                <div
                  className="order-card__collage"
                  style={{
                    width: `${containerSize}px`,
                    height: `${containerSize}px`,
                    gridTemplateColumns: gridTemplateColumns
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
                  <p className="order-card__items-names">
                    {order.items.map(item => item.name).join(', ')}
                  </p>
                  <p className="order-card__status">Status: {order.status}</p>
                  <p className="order-card__date">Date: {order.date}</p>
                </div>
                <button
                  className="button order-card__track"
                  onClick={() => alert(`Tracking order ${order.id}`)}
                >
                  Track Order
                </button>
              </div>
            );
          })
        )}
      </div>

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
