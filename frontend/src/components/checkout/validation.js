// Reusable validation functions for checkout steps

// Shipping Info Validation
export function validateShippingInfo(shippingInfo) {
  const errors = {};
  if (!shippingInfo.fullName || shippingInfo.fullName.trim().length < 2) {
    errors.fullName = "Full name is required.";
  }
  if (!shippingInfo.address || shippingInfo.address.trim().length < 5) {
    errors.address = "Address is required.";
  }
  if (!shippingInfo.city || shippingInfo.city.trim().length < 2) {
    errors.city = "City is required.";
  }
  if (!shippingInfo.postalCode || shippingInfo.postalCode.trim().length < 3) {
    errors.postalCode = "Postal code is required.";
  }
  if (!shippingInfo.country || shippingInfo.country.trim().length < 2) {
    errors.country = "Country is required.";
  }
  return errors;
}

// Payment Info Validation
export function validatePaymentInfo(paymentInfo) {
  const errors = {};
  if (!paymentInfo.cardNumber || !/^\d{12,19}$/.test(paymentInfo.cardNumber.replace(/\s/g, ""))) {
    errors.cardNumber = "Card number must be 12-19 digits.";
  }
  if (
    !paymentInfo.expiry ||
    !/^(\d{2}\/\d{2}|\d{2,4}\/?\d{2,4})$/.test(paymentInfo.expiry.replace(/\s/g, ""))
  ) {
    errors.expiry = "Expiry must be MM/YY or MMYYYY.";
  }
  if (!paymentInfo.cvv || !/^\d{3,4}$/.test(paymentInfo.cvv)) {
    errors.cvv = "CVV must be 3 or 4 digits.";
  }
  return errors;
}

// Cart Items Validation (optional, for completeness)
export function validateCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "Your cart is empty.";
  }
  for (const item of items) {
    if (!item.name || !item.price || !item.quantity) {
      return "Cart contains invalid items.";
    }
  }
  return null;
}
