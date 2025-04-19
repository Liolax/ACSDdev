import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';

const BuyerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const ordersResponse = await axios.get('/buyer/orders');
        const wishlistResponse = await axios.get('/buyer/wishlist');
        const cartResponse = await axios.get('/buyer/cart');
        
        setOrders(ordersResponse.data);
        setWishlist(wishlistResponse.data);
        setCart(cartResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading dashboard data...</p>;

  return (
    <div className="buyer-dashboard">
      <h2 className="buyer-dashboard__header">Buyer Dashboard</h2>
      <div className="buyer-dashboard__content">
        <section className="orders-section">
          <h3>Recent Orders</h3>
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                {order.productName} – <span>{order.status}</span> ({order.date})
              </li>
            ))}
          </ul>
        </section>
        <section className="wishlist-section">
          <h3>Wishlist</h3>
          <ul>
            {wishlist.map((item) => (
              <li key={item.id}>{item.name} – ${item.price}</li>
            ))}
          </ul>
        </section>
        <section className="cart-section">
          <h3>Cart Summary</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} – ${item.price} x {item.quantity}
              </li>
            ))}
          </ul>
          <p>
            Total: $
            {cart.reduce((total, item) => total + item.price * item.quantity, 0)}
          </p>
        </section>
        <section className="dashboard-actions">
          <h3>Quick Actions</h3>
          <div className="actions-container">
            <button>Track Shipment</button>
            <button>Update Profile</button>
            <button>View Detailed Orders</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BuyerDashboard;
