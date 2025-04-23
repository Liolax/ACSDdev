import React from 'react';
import '../assets/styles/components/_community.scss'; // Style import for community section

const OurCommunity = () => {
  return (
    <section className="home-page__community">
      <h2>Our Community</h2>
      <p>
        At ÉireCraft, our community is at the heart of our marketplace. We empower independent Irish artisans
        by providing a dedicated platform to showcase authentic, handmade products while connecting them with local
        residents, tourists, and ethically minded consumers around the globe.
      </p>
      <p>
        Whether you're a buyer looking to purchase unique handmade items or a seller hoping to share your craftsmanship with the world, 
        simply log in as a buyer to buy or as a seller to sell. Our platform supports both sides of the market seamlessly.
      </p>
      <p>
        Our unique approach preserves cultural heritage and supports sustainable businesses. By integrating dynamic
        shipping options and real-time exchange rate conversions tailored to user geolocation, our platform delivers
        a seamless and purposeful shopping experience.
      </p>
    </section>
  );
};

export default OurCommunity;