import React, { useState, useEffect } from 'react';
import WishlistSection from './WishlistSection';
import CartSection from './CartSection';

const BuyerDashboard = () => {
  // Orders state for "My Purchases"
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Dummy order data updated to include images
  useEffect(() => {
    const dummyOrders = [
      {
        id: 'A1001',
        product: 'Handwoven Basket',
        status: 'Shipped',
        date: '2023-05-01',
        image: 'https://picsum.photos/100/100?random=11'
      },
      {
        id: 'A1002',
        product: 'Artisan Vase',
        status: 'Delivered',
        date: '2023-04-25',
        image: 'https://picsum.photos/100/100?random=12'
      },
      {
        id: 'A1003',
        product: 'Bog Oak Bowl',
        status: 'Processing',
        date: '2023-05-03',
        image: 'https://picsum.photos/100/100?random=13'
      },
    ];
    setOrders(dummyOrders);
    setLoadingOrders(false);
  }, []);

  // Wishlist and Cart state (dummy data for simulation)
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlistVisible, setWishlistVisible] = useState(5);
  const [cartVisible, setCartVisible] = useState(5);

  useEffect(() => {
    const dummyWishlist = Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1,
      name: `Wishlist Item ${index + 1}`,
      price: parseFloat((Math.random() * 50).toFixed(2)),
      image: `https://picsum.photos/300/200?random=${index + 101}`,
    }));
    const dummyCart = Array.from({ length: 8 }).map((_, index) => ({
      id: index + 1,
      name: `Cart Item ${index + 1}`,
      price: parseFloat((Math.random() * 75).toFixed(2)),
      quantity: Math.floor(Math.random() * 3) + 1,
      image: `https://picsum.photos/300/200?random=${index + 201}`,
    }));
    setWishlist(dummyWishlist);
    setCart(dummyCart);
  }, []);

  // Wishlist handlers – including "Move to Cart"
  const handleRemoveWishlist = (id) =>
    setWishlist(wishlist.filter((item) => item.id !== id));
  const handleMoveToCart = (item) => {
    setWishlist(wishlist.filter((w) => w.id !== item.id));
    const existingCartItem = cart.find((c) => c.id === item.id);
    if (existingCartItem) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Cart handlers
  const handleRemoveCart = (id) => setCart(cart.filter((item) => item.id !== id));
  const handlePay = () => alert('Proceed to payment and shipping selection.');
  const handleWishlistSeeLess = () => setWishlistVisible(5);
  const handleCartSeeLess = () => setCartVisible(5);

  return (
    <div className="buyer-dashboard">
      {/* My Purchases title styled like "Welcome to the Market" */}
      <h2 className="buyer-dashboard__header">My Purchases</h2>

      {/* Quick Links for Wishlist & Cart (Right-Aligned) */}
      <div className="buyer-dashboard__quick-links">
        <a href="#wishlist-section" className="buyer-dashboard__quick-link">❤️ Wishlist</a>
        <a href="#cart-section" className="buyer-dashboard__quick-link">🛒 Cart</a>
      </div>

      <div className="buyer-dashboard__orders">
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              {order.image && (
                <img src={order.image} alt={order.product} className="order-card__image" />
              )}
              <div className="order-card__info">
                <h3 className="order-card__id">Order {order.id}</h3>
                <p className="order-card__product">{order.product}</p>
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
          ))
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
