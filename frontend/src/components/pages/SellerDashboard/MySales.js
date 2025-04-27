import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../ui/Button';
import '../../../assets/styles/pages/_my-sales.scss'; 

const MySales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const sellerId = localStorage.getItem('userId');

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/orders?sellerId=${sellerId}`)
      .then(res => {
        // Filter orders that are delivered (completed sales).
        const deliveredSales = res.data.filter(order => order.status === 'Delivered');
        setSales(deliveredSales);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load sales.');
        setLoading(false);
      });
  }, [sellerId]);

  return (
    <div className="my-sales">
      <h2 className="my-sales__header">My Sales</h2>
      {loading ? (
        <p>Loading sales...</p>
      ) : error ? (
        <p className="my-sales__error">{error}</p>
      ) : sales.length === 0 ? (
        <p className="my-sales__empty">You have no completed sales yet.</p>
      ) : (
        <div className="my-sales__list">
          {sales.map(order => (
            <div key={order._id} className="order-card my-sales__order-card">
              <h3 className="order-card__id">Order {order._id}</h3>
              <p className="order-card__date">{new Date(order.date).toLocaleDateString()}</p>
              <div className="order-card__details">
                <p className="order-card__items-names">
                  {order.items.map(item => item.name).join(', ')}
                </p>
                <p className="order-card__status">Status: {order.status}</p>
              </div>
              {order.feedback?.given && (
                <div className="order-card__feedback">
                  <b>Feedback:</b>
                  <p>Rating: {order.feedback.rating} ★</p>
                  <p>Title: {order.feedback.title}</p>
                  <p>Comments: {order.feedback.comments}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySales;
