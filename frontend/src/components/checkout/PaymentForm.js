import React, { useState, useEffect } from 'react';
import { validatePaymentInfo } from './validation';

const PaymentForm = ({ paymentInfo, setPaymentInfo, errors = {}, setErrors }) => {
  const [localErrors, setLocalErrors] = useState({});

  useEffect(() => {
    setLocalErrors(errors);
  }, [errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
    const newErrors = validatePaymentInfo({ ...paymentInfo, [name]: value });
    setLocalErrors(newErrors);
    if (setErrors) setErrors(newErrors);
  };

  return (
    <div className="payment-form">
      <h3>Payment Information</h3>
      <form>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentInfo.cardNumber || ''}
            onChange={handleChange}
            required
          />
          {localErrors.cardNumber && <span className="form-error">{localErrors.cardNumber}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="expiry">Expiry Date:</label>
          <input
            type="text"
            id="expiry"
            name="expiry"
            placeholder="MM/YY"
            value={paymentInfo.expiry || ''}
            onChange={handleChange}
            required
          />
          {localErrors.expiry && <span className="form-error">{localErrors.expiry}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV:</label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={paymentInfo.cvv || ''}
            onChange={handleChange}
            required
          />
          {localErrors.cvv && <span className="form-error">{localErrors.cvv}</span>}
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
