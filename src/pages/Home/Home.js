import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.scss';

const Home = () => {
  // Simulated product thumbnails for display
  const products = [
    { id: 1, name: 'Artisan Vase', price: 45 },
    { id: 2, name: 'Handwoven Basket', price: 30 },
    { id: 3, name: 'Custom Jewelry', price: 60 },
    { id: 4, name: 'Organic Candle', price: 25 }
  ];

  return (
    <div className={styles["home-container"]}>
      <header className={styles.header}>
        <div className={styles["logo"]}>
          <img src="/assets/images/logo.svg" alt="ÉireCraft Logo" />
          <span>ÉireCraft - Artisan Market</span>
        </div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      <main className={styles["main-content"]}>
        {products.map((product) => (
          <div key={product.id} className={styles["product-thumbnail"]}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <Link to="/login">See More</Link>
          </div>
        ))}
      </main>

      <section className={styles["cta-section"]}>
        <button className={styles["cta-button"]} onClick={() => console.log('CTA Clicked')}>
          See More
        </button>
      </section>

      <footer className={styles.footer}>
        <p>Contact Info | Social Media Icons</p>
      </footer>
    </div>
  );
};

export default Home;
