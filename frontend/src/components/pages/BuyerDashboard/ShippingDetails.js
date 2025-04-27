import React, { useState } from 'react';
import Button from '../../ui/Button';
import '../../../assets/styles/pages/_shipping-details.scss';

const ShippingDetails = ({ onSubmit }) => {
  const [details, setDetails] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(details);
  };

  return (
    <form className="shipping-details" onSubmit={handleSubmit}>
      <h3 className="shipping-details__title">Shipping Details</h3>
      <div className="shipping-details__fields">
        <input
          className="shipping-details__input"
          name="address"
          placeholder="Address"
          value={details.address}
          onChange={handleChange}
          required
        />
        <input
          className="shipping-details__input"
          name="city"
          placeholder="City"
          value={details.city}
          onChange={handleChange}
          required
        />
        <input
          className="shipping-details__input"
          name="postalCode"
          placeholder="Postal Code"
          value={details.postalCode}
          onChange={handleChange}
          required
        />
        <input
          className="shipping-details__input"
          name="country"
          placeholder="Country"
          value={details.country}
          onChange={handleChange}
          required
        />
      </div>
      <Button className="shipping-details__button" type="submit">
        Continue to Payment
      </Button>
    </form>
  );
};

export default ShippingDetails;
