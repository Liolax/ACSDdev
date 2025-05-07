import React from 'react';
import '../assets/styles/components/_community.scss';

const OurCommunity = () => {
  return (
    <section className="eirecraft-portfolio" aria-labelledby="eirecraft-portfolio-heading">
      <div className="eirecraft-portfolio__header">
        <h2 id="eirecraft-portfolio-heading">Welcome to ÉireCraft: Our Story & Vision</h2>
        <p className="eirecraft-portfolio__tagline">
          Connecting Hearts, Hands, and Heritage – From Ireland to the World.
        </p>
      </div>

      <div className="eirecraft-portfolio__content">
        <div className="eirecraft-portfolio__section">
          <h3>Our Mission</h3>
          <p>
            At ÉireCraft, our mission is to champion the spirit of Irish craftsmanship. We are dedicated to empowering
            independent Irish artisans by providing a vibrant and accessible global platform. We strive to connect them
            with a discerning audience that values authenticity, quality, and the rich narrative woven into each handmade product.
          </p>
        </div>

        <div className="eirecraft-portfolio__section">
          <h3>The Heart of Our Marketplace</h3>
          <p>
            ÉireCraft is more than just a marketplace; it's a celebration of Irish culture and creativity. We bridge the gap
            between talented artisans and a worldwide community of buyers – from local enthusiasts and tourists visiting Ireland
            to ethically-minded consumers across the globe seeking unique, handcrafted treasures.
          </p>
          <p>
            Our platform is thoughtfully designed to support both sides of this creative exchange.
            Whether you're looking to discover and purchase unique handmade items or an artisan eager to share your
            craftsmanship, ÉireCraft offers a seamless and supportive experience.
          </p>
        </div>

        <div className="eirecraft-portfolio__section">
          <h3>Our Values & Commitment</h3>
          <ul>
            <li>
              <strong>Authenticity:</strong> Showcasing genuine, handcrafted goods that tell a story of Irish tradition and innovation.
            </li>
            <li>
              <strong>Empowerment:</strong> Providing artisans with the tools and reach to grow their independent businesses.
            </li>
            <li>
              <strong>Cultural Preservation:</strong> Playing a part in sustaining Ireland's rich artistic heritage for future generations.
            </li>
            <li>
              <strong>Ethical Consumption:</strong> Fostering a marketplace where conscious consumerism and support for small-scale producers thrive.
            </li>
            <li>
              <strong>Seamless Experience:</strong> Leveraging technology, like dynamic shipping options and real-time currency conversion, to create a user-friendly and purposeful journey for everyone.
            </li>
          </ul>
        </div>

        <div className="eirecraft-portfolio__section eirecraft-portfolio__invitation">
          <h3>Join Our Journey</h3>
          <p>
            Become a part of a community that cherishes artistry, supports local talent, and invests in sustainable practices.
            Discover the soul of Ireland through ÉireCraft.
          </p>
          {/* 
          <div className="eirecraft-portfolio__actions">
            <a href="/register-seller" className="eirecraft-portfolio__button">Become an Artisan</a>
            <a href="/about-eirecraft" className="eirecraft-portfolio__button eirecraft-portfolio__button--secondary">Learn More</a>
          </div>
          */}
        </div>
      </div>
    </section>
  );
};

export default OurCommunity;
