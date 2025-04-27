import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../ui/Button';
import MySales from './MySales';

const SellerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoadingOrders(true);
    axios.get('/api/orders')
      .then((res) => {
        setOrders(res.data || []);
        setLoadingOrders(false);
      })
      .catch(() => {
        setError('Failed to load orders.');
        setLoadingOrders(false);
      });
  }, []);

  const handleMarkShipped = (orderId) => {
    axios.patch(`/api/orders/${orderId}/ship`)
      .then(() => {
        setOrders(orders.map(o =>
          o._id === orderId ? { ...o, status: 'Shipped' } : o
        ));
      })
      .catch(() => setError('Failed to update order status.'));
  };

  const ordersToShip = orders.filter(o => o.status === 'Processing');

  return (
    <div className="seller-dashboard">
      <h2 className="seller-dashboard__header">Orders to Ship</h2>
      {error && <p className="seller-dashboard__error">{error}</p>}
      <div className="seller-dashboard__orders">
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : ordersToShip.length === 0 ? (
          <p className="seller-dashboard__empty">No orders pending shipment.</p>
        ) : (
          ordersToShip.map((order) => (
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
        )}
      </div>
      {/* My Sales Section */}
      <MySales />
    </div>
  );
};

export default SellerDashboard;
