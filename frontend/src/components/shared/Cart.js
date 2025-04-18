import React from 'react';
import '../../../assets/styles/shared/_cart.scss';

const Cart = () => {
  // Placeholder array — replace with dynamic data later.
  const cartItems = [];

  return (
    <div className="cart">
      <h2 className="cart__title">Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className="cart__empty">Your cart is empty.</p>
      ) : (
        <ul className="cart__list">
          {cartItems.map((item) => (
            <li key={item.id} className="cart__item">{item.name} – ${item.price}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
