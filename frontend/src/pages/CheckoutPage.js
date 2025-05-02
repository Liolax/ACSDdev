import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../api/axiosConfig';
import { createOrder, simulatePayment } from '../api/orders/ordersRequests';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentForm from '../components/checkout/PaymentForm';
import Button from '../components/ui/Button';
import '../assets/styles/pages/_checkout.scss';

const CheckoutPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loadingCart, setLoadingCart] = useState(true);
  const [error, setError] = useState(null);
  
  // Multi-step flow: 1=Cart Review, 2=Shipping, 3=Payment Simulation, 4=Confirmation
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({});
  const [paymentInfo, setPaymentInfo] = useState({});
  const [createdOrder, setCreatedOrder] = useState(null);
  
  const navigate = useNavigate();

  // Fetch current cart details
  const fetchCart = async () => {
    try {
      const response = await apiClient.get('/cart');
      setCart(response.data.cart || { items: [] });
    } catch (err) {
      console.error("Error fetching cart", err);
      setError("Failed to load cart. Please try again later.");
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  // Handler for payment simulation and order placement
  const handleSimulatePayment = async () => {
    try {
      // Create order if not created already
      let orderResponse;
      if (!createdOrder) {
        // Ensure all cartItems have price as string with two decimals
        const cartItems = cart.items.map(item => ({
          ...item,
          price: (typeof item.price === 'object' && item.price !== null && item.price.$numberDecimal)
            ? Number(item.price.$numberDecimal).toFixed(2)
            : Number(item.price).toFixed(2)
        }));
        const orderPayload = {
          cartId: cart._id,
          cartItems,
          shippingInfo,
          paymentInfo
        };
        orderResponse = await apiClient.post('/orders', orderPayload);
      }
      // Use the order id (from createdOrder or the response)
      const orderId = createdOrder ? createdOrder._id : orderResponse.data.order._id;
      // Simulate payment (this could also invoke processPayment if needed)
      await apiClient.post(`/orders/${orderId}/simulate-payment`, paymentInfo);
      
      // Save the order details if not already saved
      if (!createdOrder) {
        setCreatedOrder(orderResponse.data.order);
      }
      
      nextStep();
    } catch (err) {
      console.error("Payment simulation error:", err);
      setError("Payment simulation failed. Please try again.");
    }
  };

  const getPriceNumber = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseFloat(price);
    if (price && typeof price === 'object' && price.$numberDecimal)
      return parseFloat(price.$numberDecimal);
    return NaN;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="checkout-step">
            <h3>Cart Review</h3>
            <CheckoutSummary cart={cart} />
            <div className="checkout-step__actions">
              <Button onClick={nextStep}>Next: Shipping</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="checkout-step">
            <h3>Shipping Information</h3>
            <ShippingForm shippingInfo={shippingInfo} setShippingInfo={setShippingInfo} />
            <div className="checkout-step__actions">
              <Button onClick={prevStep}>Back</Button>
              <Button onClick={nextStep}>Next: Payment</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="checkout-step">
            <h3>Payment Simulation</h3>
            <PaymentForm paymentInfo={paymentInfo} setPaymentInfo={setPaymentInfo} />
            <div className="checkout-step__actions">
              <Button onClick={prevStep}>Back</Button>
              <Button onClick={handleSimulatePayment}>Simulate Payment</Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="checkout-step">
            <h3>Order Confirmation</h3>
            <p>Your order has been placed successfully!</p>
            {createdOrder && (
              <div className="order-details">
                <p>Order ID: {createdOrder._id}</p>
                <p>
                  Total: $
                  {cart.items.reduce((sum, item) => {
                    const priceAsNumber = getPriceNumber(item.price);
                    const quantityAsNumber = Number(item.quantity);
                    if (!isNaN(priceAsNumber) && !isNaN(quantityAsNumber)) {
                      return sum + priceAsNumber * quantityAsNumber;
                    } else {
                      console.error("Error calculating total for item:", item);
                      return sum;
                    }
                  }, 0).toFixed(2)}
                </p>
              </div>
            )}
            <div className="checkout-step__actions">
              <Button onClick={() => navigate('/')}>Return Home</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loadingCart) return <p>Loading checkout...</p>;
  if (error) return <div className="checkout-page__error">{error}</div>;

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {renderStep()}
    </div>
  );
};

export default CheckoutPage;
