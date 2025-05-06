import React, { useEffect, useState } from 'react';
import { getMySales, getOrdersToShip, markShipped } from '../api/orders/ordersRequests';
import { createProduct, updateProduct } from '../api/products/productRequests';

export default function SellerDashboard() {
  const [sales, setSales] = useState([]);
  const [toShip, setToShip] = useState([]);

  useEffect(() => {
    getMySales().then(res => setSales(res.data));
    getOrdersToShip().then(res => setToShip(res.data));
  }, []);

  const handleMarkShipped = (orderId, orderItemId) => {
    markShipped(orderId, orderItemId).then(() => {
      getOrdersToShip().then(res => setToShip(res.data));
      getMySales().then(res => setSales(res.data));
    });
  };

  return (
    <div>
      <h2>My Sales</h2>
      {sales.map(order =>
        order.orderItems.map(item => (
          <div key={item._id}>
            <div>{item.productId?.name}</div>
            <div>Status: {item.status}</div>
            {item.feedback && (
              <div>
                <b>Feedback:</b> {item.feedback.comment} (Rating: {item.feedback.rating})
              </div>
            )}
          </div>
        ))
      )}
      <h2>Orders to Ship</h2>
      {toShip.map(order =>
        order.orderItems.map(item => (
          <div key={item._id}>
            <div>{item.productId?.name}</div>
            <button onClick={() => handleMarkShipped(order._id, item._id)}>Mark Shipped</button>
          </div>
        ))
      )}
      {/* ...existing code for product creation/updating... */}
    </div>
  );
}
