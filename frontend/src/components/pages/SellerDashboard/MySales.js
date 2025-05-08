import React, { useState, useEffect } from 'react';
import { getMySales } from '../../../api/orders/ordersRequests';
import '../../../assets/styles/pages/_seller-dashboard.scss';

const MySales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMySales()
      .then((items) => setSales(items))
      .catch((error) => console.error("Failed to get sales", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="my-sales">
      <h2 className="my-sales__header">My Sales</h2>
      {loading ? (
        <p className="seller-dashboard__empty">Loading sales…</p>
      ) : (
        <div className="my-sales__list">
          {sales.length === 0 ? (
            <p className="seller-dashboard__empty">No sales yet.</p>
          ) : (
            sales.map((item) => (
              <div key={item._id} className="order-card my-sales__order-card">
                <h3 className="order-card__id">Order #{item.orderId}</h3>
                <p className="order-card__product-name">{item.name} (x{item.qty})</p>
                <p className="order-card__product-status">Status: {item.status}</p>
                <p className="order-card__product-price">€{item.price}</p>
                {item.feedback && (
                  <div className="order-card__feedback">
                    <strong>Feedback:</strong>
                    <p>Rating: {item.feedback.rating} ★</p>
                    <p>Title: {item.feedback.title}</p>
                    <p>
                      Comments: {item.feedback.comments}
                      {item.feedback.edited && <span style={{ color: '#bfa800', marginLeft: 8 }}> (Edited)</span>}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MySales;
