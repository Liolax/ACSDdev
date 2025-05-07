import React, { useEffect, useState, useRef } from 'react';
import { validateShippingInfo } from './validation';

// Utility function to fetch countries
const fetchCountries = async () => {
  const res = await fetch('https://restcountries.com/v3.1/all');
  const data = await res.json();
  // Sort by name, return array of { name, code }
  return data
    .map(c => ({
      name: c.name.common,
      code: c.cca2 || c.cca3 || c.cca2 || c.altSpellings?.[0] || c.name.common
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Helper: fetch city suggestions from GeoDB Cities API
// a free API key from RapidAPI for GeoDB Cities
const fetchCitySuggestions = async (country, cityPrefix) => {
  // Call your backend endpoint instead of using a hardcoded API key
  const url = `/api/geodb/cities?country=${country}&city=${cityPrefix}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data ? data.data.map(city => city.city) : [];
};

const ShippingForm = ({ shippingInfo, setShippingInfo, errors = {}, setErrors }) => {
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  // City suggestion state
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityFetchError, setCityFetchError] = useState('');
  const cityFetchTimeout = useRef(null);

  useEffect(() => {
    fetchCountries().then(list => {
      setCountries(list);
      setLoadingCountries(false);
    });
  }, []);

  // Fetch city suggestions as user types
  useEffect(() => {
    // Only fetch if country is selected and city has at least 2 chars
    if (
      shippingInfo.country &&
      shippingInfo.city &&
      shippingInfo.city.length >= 2
    ) {
      // Debounce API calls
      if (cityFetchTimeout.current) clearTimeout(cityFetchTimeout.current);
      setLoadingCities(true);
      setCityFetchError('');
      cityFetchTimeout.current = setTimeout(async () => {
        try {
          // Try to find country code for API (GeoDB expects ISO2)
          const selectedCountry = countries.find(
            c => c.name === shippingInfo.country
          );
          const code = selectedCountry?.code || '';
          const suggestions = await fetchCitySuggestions(code, shippingInfo.city);
          setCitySuggestions(suggestions);
        } catch (err) {
          setCitySuggestions([]);
          setCityFetchError('Could not fetch city suggestions.');
        } finally {
          setLoadingCities(false);
        }
      }, 350);
    } else {
      setCitySuggestions([]);
      setLoadingCities(false);
    }
    // eslint-disable-next-line
  }, [shippingInfo.city, shippingInfo.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
    if (setErrors) {
      const newErrors = validateShippingInfo({ ...shippingInfo, [name]: value });
      setErrors(newErrors);
    }
  };

  return (
    <div className="shipping-form" aria-label="Shipping details form">
      <h3>Shipping Details</h3>
      <form autoComplete="off" noValidate>
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={shippingInfo.fullName || ''}
            onChange={handleChange}
            required
            minLength={2}
            aria-required="true"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && <span className="form-error" id="fullName-error">{errors.fullName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={shippingInfo.address || ''}
            onChange={handleChange}
            required
            minLength={5}
            aria-required="true"
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "address-error" : undefined}
          />
          {errors.address && <span className="form-error" id="address-error">{errors.address}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="country">Country:</label>
          {loadingCountries ? (
            <span>Loading countries...</span>
          ) : (
            <select
              id="country"
              name="country"
              value={shippingInfo.country || ''}
              onChange={handleChange}
              required
              aria-required="true"
              aria-invalid={!!errors.country}
              aria-describedby={errors.country ? "country-error" : undefined}
            >
              <option value="">Select country</option>
              {countries.map(c => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          )}
          {errors.country && <span className="form-error" id="country-error">{errors.country}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="city">City/Town:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={shippingInfo.city || ''}
            onChange={handleChange}
            required
            minLength={2}
            aria-required="true"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? "city-error" : undefined}
            placeholder="Enter your city/town"
            disabled={!shippingInfo.country}
            list="city-suggestions"
            autoComplete="off"
          />
          <datalist id="city-suggestions">
            {citySuggestions.map((city, idx) => (
              <option key={city + idx} value={city} />
            ))}
          </datalist>
          {loadingCities && <span style={{ fontSize: 12, color: '#888' }}>Loading suggestions...</span>}
          {cityFetchError && <span className="form-error">{cityFetchError}</span>}
          {errors.city && <span className="form-error" id="city-error">{errors.city}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="postalCode">Postal Code:</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={shippingInfo.postalCode || ''}
            onChange={handleChange}
            required
            minLength={3}
            aria-required="true"
            aria-invalid={!!errors.postalCode}
            aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
          />
          {errors.postalCode && <span className="form-error" id="postalCode-error">{errors.postalCode}</span>}
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;
