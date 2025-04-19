// src/components/OurProducts.js
import React from 'react';

const OurProducts = ({ openLoginPopup }) => {
  const products = [
    {
      id: 1,
      name: 'Artisan Vase',
      price: 45,
      image: 'https://picsum.photos/300/200'
    },
    {
      id: 2,
      name: 'Handwoven Basket',
      price: 30,
      image: 'https://picsum.photos/300/200'
    },
    {
      id: 3,
      name: 'Bog Oak Bowl',
      price: 80,
      image: 'https://picsum.photos/300/200'
    },
    {
      id: 4,
      name: 'Organic Candle',
      price: 25,
      image: 'https://picsum.photos/300/200'
    },
    {
      id: 5,
      name: 'Custom Jewelry',
      price: 60,
      image: 'https://picsum.photos/300/200' 
    },
    {
      id: 6,
      name: 'Aran Knit Sweater',
      price: 120,
      image: 'https://picsum.photos/300/200' 
    }
  ];

  return (
    <section className="home-page__products">
      <h2>Our Products</h2>
      <div className="home-page__products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-card__image"
            />
            <div className="product-card__content">
              <h3 className="product-card__content__title">{product.name}</h3>
              <p className="product-card__content__price">${product.price}</p>
              {/* A button that triggers the login modal */}
              <button className="button" onClick={openLoginPopup}>
                See More
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurProducts;
