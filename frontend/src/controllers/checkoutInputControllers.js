// Payment field validators
export const validateCardNumber = (num) => /^\d{12,19}$/.test(num.replace(/\s/g, ''));
export const validateExpiry = (exp) => /^(\d{2}\/\d{2}|\d{2,4}\/?\d{2,4})$/.test(exp.replace(/\s/g, ''));
export const validateCVV = (cvv) => /^\d{3,4}$/.test(cvv);

// Shipping field validators
export const validatePostalCode = (postal) => /^[A-Za-z0-9\s\-]{3,10}$/.test(postal);
export const validateRequired = (val) => !!val && val.trim().length > 0;

// Generic input change handler for forms
export function handleInputChange(e, state, setState, validators = {}, setErrors) {
  const { name, value } = e.target;
  setState({ ...state, [name]: value });

  if (validators[name]) {
    const error = validators[name](value) ? '' : validators[name + 'Msg'] || 'Invalid value';
    setErrors((prev) => ({ ...prev, [name]: error }));
  }
}
