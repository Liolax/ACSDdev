import React, { useEffect, useState } from 'react';
import { getMyPurchases, markDelivered, addFeedback } from '../api/orders/ordersRequests';

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([]);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    getMyPurchases().then(res => setOrders(res.data));
  }, []);

  const handleMarkDelivered = (orderId, orderItemId) => {
    markDelivered(orderId, orderItemId).then(() => {
      getMyPurchases().then(res => setOrders(res.data));
    });
  };

  const handleFeedback = (orderId, orderItemId) => {
    const { rating, comment } = feedback[orderItemId] || {};
    addFeedback(orderId, orderItemId, rating, comment).then(() => {
      getMyPurchases().then(res => setOrders(res.data));
    });
  };

  return (
    <div>
      <h2>My Purchases</h2>
      {orders.map(order =>
        order.orderItems.map(item => (
          <div key={item._id}>
            <div>{item.productId?.name}</div>
            <div>Status: {item.status}</div>
            {item.status === 'Shipped' && (
              <button onClick={() => handleMarkDelivered(order._id, item._id)}>Mark Delivered</button>
            )}
            {item.status === 'Delivered' && !item.feedback && (
              <div>
                <input
                  type="number"
                  placeholder="Rating"
                  value={feedback[item._id]?.rating || ''}
                  onChange={e =>
                    setFeedback(f => ({
                      ...f,
                      [item._id]: { ...f[item._id], rating: e.target.value }
                    }))
                  }
                />
                <input
                  type="text"
                  placeholder="Comment"
                  value={feedback[item._id]?.comment || ''}
                  onChange={e =>
                    setFeedback(f => ({
                      ...f,
                      [item._id]: { ...f[item._id], comment: e.target.value }
                    }))
                  }
                />
                <button onClick={() => handleFeedback(order._id, item._id)}>Submit Feedback</button>
              </div>
            )}
            {item.feedback && (
              <div>
                <b>Your Feedback:</b> {item.feedback.comment} (Rating: {item.feedback.rating})
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
