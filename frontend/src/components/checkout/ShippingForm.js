import React from 'react';
import { validateShippingInfo } from './validation';

const ShippingForm = ({ shippingInfo, setShippingInfo, errors = {}, setErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
    if (setErrors) {
      const newErrors = validateShippingInfo({ ...shippingInfo, [name]: value });
      setErrors(newErrors);
    }
  };

  return (
    <div className="shipping-form">
      <h3>Shipping Details</h3>
      <form>
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={shippingInfo.fullName || ''}
            onChange={handleChange}
            required
          />
          {errors.fullName && <span className="form-error">{errors.fullName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={shippingInfo.address || ''}
            onChange={handleChange}
            required
          />
          {errors.address && <span className="form-error">{errors.address}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={shippingInfo.city || ''}
            onChange={handleChange}
            required
          />
          {errors.city && <span className="form-error">{errors.city}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="postalCode">Postal Code:</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={shippingInfo.postalCode || ''}
            onChange={handleChange}
            required
          />
          {errors.postalCode && <span className="form-error">{errors.postalCode}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            name="country"
            value={shippingInfo.country || ''}
            onChange={handleChange}
            required
          />
          {errors.country && <span className="form-error">{errors.country}</span>}
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;
