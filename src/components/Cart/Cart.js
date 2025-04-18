import React from 'react';
import './Cart.css'; // Create and adjust styles as needed

const Cart = () => {
  // For now, we use a placeholder. In a real application, we would fetch cart items from state.
  const cartItems = []; // Replace with dynamic data later

  return (
    <div className="cart">
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>{item.name} – {item.price}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
