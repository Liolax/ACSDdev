import React, { useState } from 'react';
import Button from '../ui/Button';
import '../../assets/styles/components/checkout/_payment-simulation.scss';

const PaymentSimulation = ({ orderId, orderAmount, onSubmit, loading }) => {
  const [selectedMethod, setSelectedMethod] = useState('Credit Card');

  const handlePayment = () => {
    if (!loading) {
      onSubmit(selectedMethod);
    }
  };

  const formatAmount = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="payment-simulation">
      <h3 className="payment-simulation__title">Payment</h3>
      <p className="payment-simulation__order-info">
        Order ID: {orderId || 'N/A'} <br />
        Amount Due: {formatAmount(orderAmount)}
      </p>
      <div className="payment-simulation__methods">
        <label className="payment-simulation__method-label">
          <input
            type="radio"
            name="paymentMethod"
            value="Credit Card"
            checked={selectedMethod === 'Credit Card'}
            onChange={(e) => setSelectedMethod(e.target.value)}
            disabled={loading}
            className="payment-simulation__method-input"
          />
          Pay with Credit Card (Simulated)
        </label>
        <label className="payment-simulation__method-label">
          <input
            type="radio"
            name="paymentMethod"
            value="PayPal"
            checked={selectedMethod === 'PayPal'}
            onChange={(e) => setSelectedMethod(e.target.value)}
            disabled={loading}
            className="payment-simulation__method-input"
          />
          Pay with PayPal (Simulated)
        </label>
      </div>
      {selectedMethod === 'Credit Card' && (
        <div className="payment-simulation__dummy-form">
          <p>(Simulated Credit Card form would appear here)</p>
        </div>
      )}
      {selectedMethod === 'PayPal' && (
        <div className="payment-simulation__dummy-form">
          <p>(Simulated PayPal login/confirmation would appear here)</p>
        </div>
      )}
      <Button
        className="payment-simulation__button button--primary"
        onClick={handlePayment}
        disabled={loading || !orderId}
      >
        {loading ? 'Processing Payment...' : `Confirm Payment (${selectedMethod})`}
      </Button>
    </div>
  );
};

export default PaymentSimulation;
