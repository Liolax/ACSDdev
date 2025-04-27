import React, { useState, useEffect } from 'react';
import { getSales } from '../../../api/orders/ordersRequests';
import Button from '../../ui/Button';
import '../../../assets/styles/pages/_my-sales.scss';

const MySales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSales()
      .then((data) => setSales(data))
      .catch((error) => console.error("Failed to get sales", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="my-sales">
      <h2 className="my-sales__header">My Sales</h2>
      {loading ? (
        <p className="my-sales__loading">Loading sales…</p>
      ) : (
        <div className="my-sales__list">
          {sales.length === 0 ? (
            <p className="my-sales__empty">No sales yet.</p>
          ) : (
            sales.map((order) => (
              <div key={order._id} className="order-card my-sales__order-card">
                <h3 className="order-card__id">Order #{order._id}</h3>
                <p className="order-card__date">
                  Date: {new Date(order.date).toLocaleDateString()}
                </p>
                <div className="order-card__details">
                  {(order.items || []).map((item) => (
                    <div key={item.productId} className="order-card__product">
                      <p className="order-card__product-name">
                        {item.name} (x{item.quantity})
                      </p>
                      <p className="order-card__product-price">
                        €{item.price.toFixed(2)}
                      </p>
                      {order.status === 'Delivered' && item.feedback?.given && (
                        <div className="order-card__feedback">
                          <strong>Feedback:</strong>
                          <p>Rating: {item.feedback.rating} ★</p>
                          <p>Title: {item.feedback.title}</p>
                          <p>Comments: {item.feedback.comments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MySales;
