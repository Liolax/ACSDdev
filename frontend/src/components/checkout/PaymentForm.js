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
    <div className="payment-form" aria-label="Payment information form">
      <h3>Payment Information</h3>
      <form noValidate>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentInfo.cardNumber || ''}
            onChange={handleChange}
            required
            inputMode="numeric"
            minLength={12}
            maxLength={19}
            aria-required="true"
            aria-invalid={!!localErrors.cardNumber}
            aria-describedby={localErrors.cardNumber ? "cardNumber-error" : undefined}
            autoComplete="cc-number"
          />
          {localErrors.cardNumber && <span className="form-error" id="cardNumber-error">{localErrors.cardNumber}</span>}
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
            aria-required="true"
            aria-invalid={!!localErrors.expiry}
            aria-describedby={localErrors.expiry ? "expiry-error" : undefined}
            autoComplete="cc-exp"
          />
          {localErrors.expiry && <span className="form-error" id="expiry-error">{localErrors.expiry}</span>}
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
            inputMode="numeric"
            minLength={3}
            maxLength={4}
            aria-required="true"
            aria-invalid={!!localErrors.cvv}
            aria-describedby={localErrors.cvv ? "cvv-error" : undefined}
            autoComplete="cc-csc"
          />
          {localErrors.cvv && <span className="form-error" id="cvv-error">{localErrors.cvv}</span>}
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
