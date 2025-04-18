import React from 'react';

const BuyerDashboard = () => {
  return (
    <div className="buyer-dashboard">
      <h2>Buyer Dashboard</h2>
      <p>
        Welcome to your dashboard! Here you can view your orders, track shipments,
        manage your wishlist and cart, and update your profile.
      </p>

      {/* Recent Orders Section */}
      <section className="orders-section">
        <h3>Recent Orders</h3>
        <ul>
          <li>
            Artisan Vase – <span>Shipped</span> (2023-10-05)
          </li>
          <li>
            Handwoven Basket – <span>Processing</span> (2023-10-07)
          </li>
        </ul>
      </section>

      {/* Wishlist Section */}
      <section className="wishlist-section">
        <h3>Wishlist</h3>
        <ul>
          <li>Custom Jewelry – $60</li>
          <li>Organic Candle – $25</li>
        </ul>
      </section>

      {/* Cart Summary Section */}
      <section className="cart-section">
        <h3>Cart Summary</h3>
        <ul>
          <li>Handcrafted Mug – $20 x 2</li>
          <li>Vintage Clock – $45 x 1</li>
        </ul>
        <p>Total: $85</p>
      </section>

      {/* Dashboard Actions */}
      <section className="dashboard-actions">
        <h3>Quick Actions</h3>
        <div className="actions-container">
          <button>Track Shipment</button>
          <button>Update Profile</button>
          <button>View Detailed Orders</button>
        </div>
      </section>
    </div>
  );
};

export default BuyerDashboard;
