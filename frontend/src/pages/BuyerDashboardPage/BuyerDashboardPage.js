import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BuyerDashboardPage.module.scss';

const BuyerDashboardPage = () => {
  const products = [
    { id: 1, name: "Handcrafted Mug", price: 20 },
    { id: 2, name: "Wool Scarf", price: 15 },
  ];

  return (
    <div className={styles["dashboard-container"]}>
      <header className={styles.header}>
        <h1>Buyer Dashboard</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/contact">Contact</Link>
          <button onClick={() => console.log("Logout")}>Logout</button>
        </nav>
      </header>

      <main>
        <section className={styles["product-section"]}>
          <h2>Products</h2>
          {products.map((product) => (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <Link to={`/product/${product.id}`}>Details</Link>
            </div>
          ))}
        </section>
      </main>

      <footer>
        <p>Contact Info | Social Media Icons</p>
      </footer>
    </div>
  );
};

export default BuyerDashboardPage;
