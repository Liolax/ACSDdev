// Validation functions for checkout steps and form fields

// Shipping Info Validation
export function validateShippingInfo(shippingInfo) {
  const errors = {};
  if (!shippingInfo.fullName || shippingInfo.fullName.trim().length < 2) {
    errors.fullName = "Full name is required and must be at least 2 characters.";
  }
  if (!shippingInfo.address || shippingInfo.address.trim().length < 5) {
    errors.address = "Address is required and must be at least 5 characters.";
  }
  if (!shippingInfo.city || shippingInfo.city.trim().length < 2) {
    errors.city = "City is required and must be at least 2 characters.";
  }
  if (!shippingInfo.postalCode || shippingInfo.postalCode.trim().length < 3) {
    errors.postalCode = "Postal code is required and must be at least 3 characters.";
  }
  if (!shippingInfo.country || shippingInfo.country.trim().length < 2) {
    errors.country = "Country is required.";
  }
  return errors;
}

// Payment Info Validation
export function validatePaymentInfo(paymentInfo) {
  const errors = {};
  // Card number: 12-19 digits, numeric only
  if (
    !paymentInfo.cardNumber ||
    !/^\d{12,19}$/.test((paymentInfo.cardNumber || '').replace(/\s/g, ""))
  ) {
    errors.cardNumber = "Card number must be 12-19 digits.";
  }
  // Expiry: MM/YY or MMYYYY or similar
  if (
    !paymentInfo.expiry ||
    !/^(\d{2}\/\d{2}|\d{2,4}\/?\d{2,4})$/.test((paymentInfo.expiry || '').replace(/\s/g, ""))
  ) {
    errors.expiry = "Expiry must be MM/YY or MMYYYY.";
  }
  // CVV: 3 or 4 digits
  if (
    !paymentInfo.cvv ||
    !/^\d{3,4}$/.test(paymentInfo.cvv)
  ) {
    errors.cvv = "CVV must be 3 or 4 digits.";
  }
  return errors;
}

// Cart Items Validation
export function validateCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "Your cart is empty.";
  }
  for (const item of items) {
    if (!item.name || !item.price || !item.quantity) {
      return "Cart contains invalid items.";
    }
    // Optionally: check for positive quantity and valid price
    if (Number(item.quantity) <= 0 || isNaN(Number(item.price))) {
      return "Cart contains items with invalid quantity or price.";
    }
  }
  return null;
}

// General-purpose field validator for dynamic forms
export function validateField(value, { required = false, minLength = 0, pattern, label = "Field" } = {}) {
  if (required && (!value || value.trim().length === 0)) {
    return `${label} is required.`;
  }
  if (minLength && value && value.trim().length < minLength) {
    return `${label} must be at least ${minLength} characters.`;
  }
  if (pattern && value && !pattern.test(value)) {
    return `${label} is not in the correct format.`;
  }
  return "";
}
