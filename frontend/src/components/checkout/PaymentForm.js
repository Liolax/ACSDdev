import React from 'react';

const PaymentForm = ({ paymentInfo, setPaymentInfo }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
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
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
