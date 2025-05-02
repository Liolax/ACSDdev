import React from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import BuyerDashboard from '../components/pages/BuyerDashboard/BuyerDashboard';
import '../assets/styles/pages/_buyer-dashboard.scss'; // Import the SCSS styles

const BuyerDashboardPage = () => {
    return (
        // Main page container with a specific class for styling
        <div className="page-container buyer-dashboard-page">
            {/* Render the Header component */}
            <Header />
            {/* Main content area for the dashboard */}
            <main className="buyer-dashboard-page__main">
                {/* Render the BuyerDashboard component */}
                <BuyerDashboard />
            </main>
            {/* Render the Footer component */}
            <Footer />
        </div>
    );
};

export default BuyerDashboardPage;