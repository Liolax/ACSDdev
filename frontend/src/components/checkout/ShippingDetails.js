import React, { useState } from 'react';
import Button from '../ui/Button';
import '../../assets/styles/components/checkout/_shipping-details.scss';

const ShippingDetails = ({ onSubmit, loading }) => {
  const [details, setDetails] = useState({
    fullName: '',
    address: '',
    address2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
  });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details.fullName || !details.address || !details.city || !details.postalCode || !details.country) {
      alert("Please fill in all required shipping fields.");
      return;
    }
    if (!loading) {
      onSubmit(details);
    }
  };

  return (
    <form className="shipping-details" onSubmit={handleSubmit}>
      <h3 className="shipping-details__title">Shipping Details</h3>
      <div className="shipping-details__fields">
        <fieldset disabled={loading} className="shipping-details__fieldset">
          <div className="shipping-details__field">
            <label htmlFor="fullName" className="shipping-details__label">Full Name *</label>
            <input
              id="fullName"
              name="fullName"
              className="shipping-details__input"
              placeholder="Full Name"
              value={details.fullName}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
          <div className="shipping-details__field">
            <label htmlFor="address" className="shipping-details__label">Address Line 1 *</label>
            <input
              id="address"
              name="address"
              className="shipping-details__input"
              placeholder="Street Address, P.O. Box"
              value={details.address}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
          <div className="shipping-details__field">
            <label htmlFor="address2" className="shipping-details__label">Address Line 2</label>
            <input
              id="address2"
              name="address2"
              className="shipping-details__input"
              placeholder="Apartment, Suite, Unit, Building (Optional)"
              value={details.address2}
              onChange={handleChange}
            />
          </div>
          <div className="shipping-details__field-group">
            <div className="shipping-details__field">
              <label htmlFor="city" className="shipping-details__label">City *</label>
              <input
                id="city"
                name="city"
                className="shipping-details__input"
                placeholder="City"
                value={details.city}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>
            <div className="shipping-details__field">
              <label htmlFor="stateProvince" className="shipping-details__label">State / Province</label>
              <input
                id="stateProvince"
                name="stateProvince"
                className="shipping-details__input"
                placeholder="State / Province"
                value={details.stateProvince}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="shipping-details__field-group">
            <div className="shipping-details__field">
              <label htmlFor="postalCode" className="shipping-details__label">Postal Code *</label>
              <input
                id="postalCode"
                name="postalCode"
                className="shipping-details__input"
                placeholder="Postal Code"
                value={details.postalCode}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>
            <div className="shipping-details__field">
              <label htmlFor="country" className="shipping-details__label">Country *</label>
              <input
                id="country"
                name="country"
                className="shipping-details__input"
                placeholder="Country"
                value={details.country}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>
          </div>
          <div className="shipping-details__field">
            <label htmlFor="phoneNumber" className="shipping-details__label">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              className="shipping-details__input"
              placeholder="Phone Number (Optional)"
              value={details.phoneNumber}
              onChange={handleChange}
            />
          </div>
        </fieldset>
      </div>
      <Button
        type="submit"
        className="shipping-details__button button--primary"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Continue to Payment'}
      </Button>
    </form>
  );
};

export default ShippingDetails;
