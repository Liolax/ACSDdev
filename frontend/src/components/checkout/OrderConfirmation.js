import React from 'react';

const OrderConfirmation = ({ orderDetails }) => {
  return (
    <div>
      <h3>Order Confirmation</h3>
      <p>Order ID: {orderDetails._id}</p>
      <p>Total: ${Number(orderDetails.totalAmount).toFixed(2)}</p>
      <p>Thank you for your purchase!</p>
    </div>
  );
};

export default OrderConfirmation;
