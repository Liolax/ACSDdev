import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const products = [
    { id: 1, name: 'Artisan Vase', price: 45 },
    { id: 2, name: 'Handwoven Basket', price: 30 },
    { id: 3, name: 'Custom Jewelry', price: 60 },
    { id: 4, name: 'Organic Candle', price: 25 }
  ];

  return (
    <div className="page-container home-page">
      <header className="home-page__header">
        <div className="home-page__logo">
          <img src="/assets/images/logo.svg" alt="ÉireCraft Logo" />
          <span>ÉireCraft - Artisan Market</span>
        </div>
        <nav className="home-page__nav">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      <main className="home-page__main-content">
        {products.map((product) => (
          <div key={product.id} className="home-page__product-thumbnail">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <Link to="/login">See More</Link>
          </div>
        ))}
      </main>

      <section className="home-page__cta-section">
        <button 
          className="home-page__cta-button" 
          onClick={() => console.log('CTA Clicked')}
        >
          See More
        </button>
      </section>

      <footer className="home-page__footer">
        <p>Contact Info | Social Media Icons</p>
      </footer>
    </div>
  );
};

export default Home;
