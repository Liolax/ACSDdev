import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../ui/Button';

const SellerDashboard = () => {
  // Orders state.
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');

  // Fetch orders from backend
  useEffect(() => {
    setLoadingOrders(true);
    setError('');
    axios.get('/api/orders')
      .then(res => {
        setOrders(res.data || []);
        setLoadingOrders(false);
      })
      .catch(() => {
        setError('Failed to load orders. Please try again.');
        setLoadingOrders(false);
      });
  }, []);

  // Seller confirms shipping
  const handleMarkShipped = (orderId) => {
    axios.patch(`/api/orders/${orderId}/ship`)
      .then(() => {
        setOrders(orders.map(o =>
          o._id === orderId ? { ...o, status: 'Shipped' } : o
        ));
      })
      .catch(() => setError('Failed to update order status.'));
  };

  return (
    <div className="seller-dashboard">
      <h2 className="seller-dashboard__header">Orders to Ship</h2>

      {error && <p className="seller-dashboard__error">{error}</p>}

      {/* Orders marked as "Processing" */}
      <div className="seller-dashboard__orders">
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : (
          orders.filter(o => o.status === 'Processing').length === 0 ? (
            <p>No orders pending shipment.</p>
          ) : (
            orders.filter(o => o.status === 'Processing').map(order => (
              <div key={order._id} className="order-card">
                <h3 className="order-card__id">Order {order._id}</h3>
                <p className="order-card__items-names">
                  {(order.items || []).map(item => item.name).join(', ')}
                </p>
                <p className="order-card__status">Status: {order.status}</p>
                <p className="order-card__date">
                  Date: {new Date(order.date).toLocaleDateString()}
                </p>

                <Button onClick={() => handleMarkShipped(order._id)}>
                  Mark as Shipped
                </Button>
              </div>
            ))
          )
        )}
      </div>

      <h2 className="seller-dashboard__header">Delivered Orders & Feedback</h2>

      {/* Orders marked as "Delivered" */}
      <div className="seller-dashboard__feedback-orders">
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : (
          orders.filter(o => o.status === 'Delivered').length === 0 ? (
            <p>No delivered orders with feedback yet.</p>
          ) : (
            orders.filter(o => o.status === 'Delivered').map(order => (
              <div key={order._id} className="order-card">
                <h3 className="order-card__id">Order {order._id}</h3>
                <p className="order-card__items-names">
                  {(order.items || []).map(item => item.name).join(', ')}
                </p>
                <p className="order-card__status">Status: {order.status}</p>
                <p className="order-card__date">
                  Date: {new Date(order.date).toLocaleDateString()}
                </p>

                {/* Show feedback if available */}
                {order.feedback?.given && (
                  <div className="order-card__feedback">
                    <b>Feedback:</b>
                    <p>Rating: {order.feedback.rating} ★</p>
                    <p>Title: {order.feedback.title}</p>
                    <p>Comments: {order.feedback.comments}</p>
                  </div>
                )}
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
