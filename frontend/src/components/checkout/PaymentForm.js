import React, { useState } from 'react';

const validateCardNumber = (num) => /^\d{12,19}$/.test(num.replace(/\s/g, ''));
const validateExpiry = (exp) => /^(\d{2}\/\d{2}|\d{2,4}\/?\d{2,4})$/.test(exp.replace(/\s/g, ''));
const validateCVV = (cvv) => /^\d{3,4}$/.test(cvv);

const PaymentForm = ({ paymentInfo, setPaymentInfo }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });

    // Validate on change
    let err = {};
    if (name === 'cardNumber' && value && !validateCardNumber(value)) {
      err.cardNumber = 'Card number must be 12-19 digits.';
    }
    if (name === 'expiry' && value && !validateExpiry(value)) {
      err.expiry = 'Expiry must be MM/YY or MMYYYY.';
    }
    if (name === 'cvv' && value && !validateCVV(value)) {
      err.cvv = 'CVV must be 3 or 4 digits.';
    }
    setErrors({ ...errors, ...err });
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
          {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
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
          {errors.expiry && <span className="form-error">{errors.expiry}</span>}
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
          {errors.cvv && <span className="form-error">{errors.cvv}</span>}
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
