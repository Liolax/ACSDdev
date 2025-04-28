import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import CartReview from '../components/checkout/CartReview'; // Stub or implement your CartReview component
import ShippingDetails from '../components/checkout/ShippingDetails';
import PaymentSimulation from '../components/checkout/PaymentSimulation';
import OrderConfirmation from '../components/checkout/OrderConfirmation'; // Stub or implement your OrderConfirmation component
import { getCart } from '../api/cart/cartRequests';
import { createOrder, processPayment } from '../api/orders/ordersRequests';
import '../assets/styles/pages/_checkout-page.scss';

const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Cart Review, 2: Shipping, 3: Payment, 4: Confirmation
  const [cartItems, setCartItems] = useState([]);
  // Removed unused shippingInfo variable
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && step === 1) {
      setLoading(true);
      getCart()
        .then((data) => {
          setCartItems(data?.items || []);
          if (!data || !data.items || data.items.length === 0) {
            setError("Your cart is empty.");
          } else {
            setError(null);
          }
        })
        .catch((err) => {
          console.error("Error fetching cart for checkout:", err);
          setError("Could not load your cart. Please try again.");
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, step]);

  const handleShippingSubmit = async (details) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await createOrder({ ...details, items: cartItems, userId: user._id });
      setOrderId(newOrder._id);
      setOrderDetails(newOrder);
      setStep(3);
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Failed to save shipping details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (paymentMethod) => {
    if (!orderId) {
      setError("Order ID is missing. Cannot process payment.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await processPayment(orderId, {
        method: paymentMethod,
        transactionId: `sim_${Date.now()}`
      });
      setOrderDetails(updatedOrder);
      setStep(4);
    } catch (err) {
      console.error("Error processing payment:", err);
      setError(`Payment failed (${paymentMethod}). Please try again or contact support.`);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (!isAuthenticated) {
      return <p>Please log in to proceed with checkout.</p>;
    }
    if (error && step < 4) {
      return <p className="error-message">{error}</p>;
    }
    switch (step) {
      case 1:
        return (
          <CartReview
            cartItems={cartItems}
            loading={loading}
            error={error}
            onProceed={() => { if (cartItems.length > 0) setStep(2); }}
          />
        );
      case 2:
        return <ShippingDetails onSubmit={handleShippingSubmit} loading={loading} />;
      case 3:
        return (
          <PaymentSimulation
            orderId={orderId}
            orderAmount={orderDetails?.totalAmount}
            onSubmit={handlePaymentSubmit}
            loading={loading}
          />
        );
      case 4:
        return <OrderConfirmation orderDetails={orderDetails} />;
      default:
        return <p>Invalid checkout step.</p>;
    }
  };

  return (
    <div className="page-container checkout-page">
      <Header />
      <main className="checkout-page__main">
        <h1 className="checkout-page__title">Checkout</h1>
        <div className="checkout-page__content">
          {renderStep()}
        </div>
        {error && step < 4 && <p className="checkout-page__error">{error}</p>}
        {loading && <p>Processing...</p>}
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
