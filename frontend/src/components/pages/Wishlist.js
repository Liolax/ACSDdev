import React from 'react';
 
const Wishlist = () => {
  const wishlistItems = []; // Replace with dynamic data

  return (
    <div className="wishlist">
      <h2 className="wishlist__header">Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p className="wishlist__empty">Your wishlist is currently empty.</p>
      ) : (
        <ul className="wishlist__list">
          {wishlistItems.map(item => (
            <li key={item.id} className="wishlist__item">{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
