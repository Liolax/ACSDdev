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
import { validateShippingInfo, validatePaymentInfo, validateCartItems } from '../components/checkout/validation';
import { getCart } from '../api/cart/cartRequests';

const CheckoutPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loadingCart, setLoadingCart] = useState(true);
  const [error, setError] = useState(null);
  
  // Multi-step flow: 1=Cart Review, 2=Shipping, 3=Payment Simulation, 4=Confirmation
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({});
  const [paymentInfo, setPaymentInfo] = useState({});
  const [createdOrder, setCreatedOrder] = useState(null);
  const [shippingErrors, setShippingErrors] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});
  const [geoPermission, setGeoPermission] = useState(null); // null=not asked, true/false
  const [geoData, setGeoData] = useState(null); // { country, city, currency, currency_symbol }
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedTotal, setConvertedTotal] = useState(null);
  const [showCurrency, setShowCurrency] = useState(false);
  
  const navigate = useNavigate();

  // Fetch current cart details
  const fetchCart = async () => {
    try {
      // getCart() already returns the cart object, not { cart: ... }
      const cartData = await getCart();
      setCart(cartData || { items: [] });
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

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate cart
      const cartError = validateCartItems(cart.items);
      if (cartError) {
        setError(cartError);
        return;
      }
      setError(null);
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 2) {
      // Validate shipping info
      const errors = validateShippingInfo(shippingInfo);
      setShippingErrors(errors);
      if (Object.keys(errors).length > 0) return;
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 3) {
      // Validate payment info
      const errors = validatePaymentInfo(paymentInfo);
      setPaymentErrors(errors);
      if (Object.keys(errors).length > 0) return;
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

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
        // Use the correct API call for order creation
        orderResponse = await createOrder(orderPayload);
      }
      // Use the order id (from createdOrder or the response)
      const orderId = createdOrder ? createdOrder._id : orderResponse.data.order._id;
      console.log("Extracted Order ID:", orderId);
      // Simulate payment (wrap paymentInfo in paymentDetails)
      await simulatePayment(orderId, paymentInfo);
      
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

  // Helper: get total in euros
  const getTotalEuro = () => {
    return cart.items.reduce((sum, item) => {
      const priceAsNumber = getPriceNumber(item.price);
      const quantityAsNumber = Number(item.quantity);
      if (!isNaN(priceAsNumber) && !isNaN(quantityAsNumber)) {
        return sum + priceAsNumber * quantityAsNumber;
      }
      return sum;
    }, 0);
  };

  // Fetch geolocation and currency info by IP
  const fetchGeoData = async () => {
    try {
      // Use ipapi.co for simplicity (no API key required for basic info)
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      setGeoData({
        country: data.country_name,
        country_code: data.country_code,
        city: data.city,
        currency: data.currency,
        currency_symbol: data.currency_symbol
      });
      return data;
    } catch (err) {
      setGeoData(null);
    }
  };

  // Fetch exchange rate from EUR to target currency using Frankfurter.app
  const fetchExchangeRate = async (targetCurrency) => {
    try {
      if (!targetCurrency || targetCurrency === 'EUR') {
        setExchangeRate(1);
        return 1;
      }
      // Frankfurter API: https://www.frankfurter.app/docs/
      const res = await fetch(`https://api.frankfurter.app/latest?from=EUR&to=${targetCurrency}`);
      const data = await res.json();
      if (data && data.rates && data.rates[targetCurrency]) {
        setExchangeRate(data.rates[targetCurrency]);
        return data.rates[targetCurrency];
      } else {
        setExchangeRate(null);
        return null;
      }
    } catch (err) {
      setExchangeRate(null);
      return null;
    }
  };

  // When permission granted, fetch geo and exchange rate
  useEffect(() => {
    if (geoPermission) {
      fetchGeoData().then((data) => {
        if (data && data.currency) {
          fetchExchangeRate(data.currency);
        }
      });
    }
  }, [geoPermission]);

  // When exchange rate or cart changes, update converted total
  useEffect(() => {
    if (exchangeRate && geoData && geoData.currency) {
      const euroTotal = getTotalEuro();
      setConvertedTotal(euroTotal * exchangeRate);
    }
  }, [exchangeRate, cart, geoData]);

  // Autofill shipping fields if geoData available and permission granted
  useEffect(() => {
    if (
      currentStep === 2 &&
      geoPermission &&
      geoData &&
      (!shippingInfo.country || !shippingInfo.city)
    ) {
      setShippingInfo((prev) => ({
        ...prev,
        country: geoData.country || prev.country,
        city: geoData.city || prev.city
      }));
    }
    // eslint-disable-next-line
  }, [currentStep, geoPermission, geoData]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        // Debug: log geo/currency/exchangeRate state before rendering summary
        console.log('[CheckoutPage] geoPermission:', geoPermission, 'geoData:', geoData, 'exchangeRate:', exchangeRate, 'showCurrency:', showCurrency);
        const canConvert = geoPermission && geoData && geoData.currency && typeof exchangeRate === 'number' && !isNaN(exchangeRate) && exchangeRate !== 1;
        const currencySymbol = geoData && (geoData.currency_symbol || geoData.currency || '€');
        return (
          <div className="checkout-step">
            {/* Geolocation permission UI */}
            {geoPermission === null && (
              <div style={{ marginBottom: 16, background: '#f5fbe6', padding: 12, borderRadius: 8 }}>
                <p>
                  Would you like us to detect your country and currency by your IP address to show prices in your local currency and autofill shipping details?
                </p>
                <Button onClick={() => setGeoPermission(true)} style={{ marginRight: 8 }}>
                  Allow
                </Button>
                <Button onClick={() => setGeoPermission(false)} variant="secondary">
                  Deny
                </Button>
              </div>
            )}
            {geoPermission && geoData && geoData.currency && (
              <div style={{ marginBottom: 12, background: '#eafff3', padding: 10, borderRadius: 8 }}>
                <span>
                  Detected country: <b>{geoData.country}</b> &nbsp;|&nbsp; Currency: <b>{geoData.currency} ({currencySymbol})</b>
                </span>
                <Button
                  style={{ marginLeft: 16, fontSize: 13, padding: '2px 10px' }}
                  onClick={() => setShowCurrency((v) => !v)}
                  disabled={!canConvert}
                >
                  {showCurrency ? 'Show in EUR' : `Show in ${geoData.currency}`}
                </Button>
                {!canConvert && (
                  <span style={{ color: '#b10e0e', marginLeft: 12, fontSize: 13 }}>
                    Currency conversion unavailable for {geoData.currency}
                  </span>
                )}
              </div>
            )}
            <CheckoutSummary
              cart={cart}
              currency={geoPermission && geoData && geoData.currency ? geoData.currency : 'EUR'}
              currencySymbol={currencySymbol}
              exchangeRate={geoPermission && geoData && geoData.currency && typeof exchangeRate === 'number' && !isNaN(exchangeRate) ? exchangeRate : 1}
              showCurrency={geoPermission && geoData && geoData.currency && showCurrency && canConvert}
            />
            {/* Show converted price if allowed and toggled */}
            {geoPermission && geoData && geoData.currency && showCurrency && canConvert && convertedTotal && (
              <div style={{ margin: '10px 0', fontWeight: 600, color: '#b58319' }}>
                Total in {geoData.currency}: {currencySymbol}
                {convertedTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            )}
            <div className="checkout-step__actions">
              <Button data-action="back" className="checkout-back-btn" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button data-action="next" className="checkout-next-btn" onClick={nextStep}>
                Next: Shipping
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="checkout-step">
            <ShippingForm
              shippingInfo={shippingInfo}
              setShippingInfo={setShippingInfo}
              errors={shippingErrors}
              setErrors={setShippingErrors}
            />
            <div className="checkout-step__actions">
              <Button data-action="back" className="checkout-back-btn" onClick={prevStep}>
                Back
              </Button>
              <Button data-action="next" className="checkout-next-btn" onClick={nextStep}>
                Next: Payment
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="checkout-step">
            <PaymentForm
              paymentInfo={paymentInfo}
              setPaymentInfo={setPaymentInfo}
              errors={paymentErrors}
              setErrors={setPaymentErrors}
            />
            <div className="checkout-step__actions">
              <Button data-action="back" className="checkout-back-btn" onClick={prevStep}>
                Back
              </Button>
              <Button data-action="simulate" className="checkout-simulate-btn" onClick={handleSimulatePayment}>
                Simulate Payment
              </Button>
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
                  Total: €
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
