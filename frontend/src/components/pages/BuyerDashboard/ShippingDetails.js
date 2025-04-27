import React, { useState } from 'react';
import axios from 'axios';

const ShippingDetails = ({ cartItems, onOrderPlaced }) => {
  const [form, setForm] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const buyerId = localStorage.getItem('userId');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await axios.post('/api/orders', {
        buyerId,
        items: cartItems.map(item => ({
          productId: item.id || item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        shippingDetails: form
      });
      setSubmitting(false);
      onOrderPlaced(res.data);
    } catch (err) {
      setError('Failed to place order. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="shipping-details">
      <h2 className="shipping-details__header">Shipping Details</h2>
      <form className="shipping-details__form" onSubmit={handleSubmit}>
        <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input type="text" name="postalCode" placeholder="Postal Code" value={form.postalCode} onChange={handleChange} required />
        <input type="text" name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
        {error && <div className="shipping-details__error">{error}</div>}
      </form>
    </div>
  );
};

export default ShippingDetails;
