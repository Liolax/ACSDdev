import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WishlistSection from './WishlistSection'; // Adjust if needed
import CartSection from './CartSection';
import FeedbackPopup from '../../ui/FeedbackPopup';
import Button from '../../ui/Button';
import '../../../assets/styles/pages/_buyer-dashboard.scss';
import getImageUrl from '../../../helpers/getImageUrl';
import { moveWishlistItemToCart, removeFromWishlist } from '../../../api/wishlist/wishlistRequests';
// Assuming cart requests are handled by cartRequests.js
import { updateCartItemQuantity, removeFromCart as removeFromCartApi } from '../../../api/cart/cartRequests';


// Helper function to determine collage style based on item count
const getCollageStyle = (count) => {
    let containerSize = 120; // Base size
    let gridTemplateColumns = '1fr'; // Default for 1 item

    if (count === 1) {
        gridTemplateColumns = '1fr';
    } else if (count === 2) {
        gridTemplateColumns = 'repeat(2, 1fr)';
    } else if (count === 3 || count === 4) {
        gridTemplateColumns = 'repeat(2, 1fr)'; // 2x2 grid for 3 or 4 items
    } else {
        gridTemplateColumns = 'repeat(3, 1fr)'; // 3 columns for 5+ items
    }
    // Note: You might want to adjust containerSize or add more logic for different counts
    // to prevent images from becoming too small or too large.

    return { containerSize, gridTemplateColumns };
};


const BuyerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    // For wishlist, we store the entire document returned from the API (which contains an "items" array)
    const [wishlist, setWishlist] = useState(null);
    // For cart, we store the entire document returned from the API (which contains an "items" array)
    const [cart, setCart] = useState({ items: [] });
    const [wishlistVisible, setWishlistVisible] = useState(5); // Number of wishlist items initially visible
    const [cartVisible, setCartVisible] = useState(5); // Number of cart items initially visible
    const [feedbackByOrder, setFeedbackByOrder] = useState({}); // State to track feedback status for orders
    const [feedbackOrderId, setFeedbackOrderId] = useState(null); // State to manage which order's feedback popup is open

    // Fetch orders on component mount
    useEffect(() => {
        axios.get('/api/orders')
            .then((res) => {
                setOrders(res.data);
                setLoadingOrders(false);
            })
            .catch((err) => {
                console.error("Error fetching orders:", err);
                setOrders([]); // Set orders to empty array on error
                setLoadingOrders(false);
            });
    }, []); // Empty dependency array means this effect runs once on mount

    // Fetch wishlist and cart on component mount
    useEffect(() => {
        // Fetch Wishlist
        axios.get('/api/wishlist')
            .then((res) => {
                // The backend returns an object like { success: true, wishlist: { ... } }
                // We want to store the 'wishlist' object which contains the 'items' array
                setWishlist(res.data.wishlist);
            })
            .catch((err) => {
                console.error("Error fetching wishlist:", err);
                setWishlist(null); // Set wishlist to null on error
            });

        // Fetch Cart
        axios.get('/api/cart')
            .then((res) => {
                // The backend returns an object like { success: true, cart: { ... } }
                // We want to store the 'cart' object which contains the 'items' array
                setCart(res.data.cart || { items: [] }); // Ensure cart is an object with an items array
            })
            .catch((err) => {
                console.error("Error fetching cart:", err);
                setCart({ items: [] }); // Set cart to an empty state on error
            });
    }, []); // Empty dependency array means this effect runs once on mount

    // Re-fetch the cart when the window regains focus (useful if cart is modified in another tab/window)
    useEffect(() => {
        const fetchCart = () => {
            axios.get('/api/cart')
                .then((res) => setCart(res.data.cart || { items: [] }))
                .catch((err) => {
                    console.error("Error fetching cart:", err);
                    setCart({ items: [] });
                });
        };
        window.addEventListener('focus', fetchCart);
        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('focus', fetchCart);
        };
    }, []); // Empty dependency array means this effect runs once on mount

    // Wishlist Handlers

    // Handle removing an item from the wishlist
    const handleRemoveWishlist = (productId) => {
        removeFromWishlist(productId) // Call the API request function
            .then((res) => {
                // Update the wishlist state with the new wishlist data from the response
                setWishlist(res.wishlist);
            })
            .catch((err) => console.error("Error removing wishlist item:", err));
    };

    // Handle moving an item from the wishlist to the cart
    const handleMoveToCart = (productId) => {
        // Call the API request function to move the item
        moveWishlistItemToCart(productId)
            .then((res) => {
                // Update both wishlist and cart states with the new data from the response
                setWishlist(res.wishlist);
                setCart(res.cart);
            })
            .catch((err) => console.error("Error moving item to cart:", err));
    };

    // Handle showing fewer wishlist items
    const handleWishlistSeeLess = () => setWishlistVisible(5);

    // Cart Handlers

    // Handle removing an item from the cart
    const handleRemoveCart = (productId) => {
        // Call the API request function to remove the item
        removeFromCartApi(productId)
            .then((res) => {
                // Update the cart state with the new cart data from the response
                setCart(res.cart);
            })
            .catch((err) => console.error("Error removing cart item:", err));
    };

    // Handle updating the quantity of a cart item
    const handleUpdateQuantity = (productId, newQuantity) => {
        // Prevent updating to a quantity less than 1
        if (newQuantity < 1) return;

        // Call the API request function to update the quantity
        updateCartItemQuantity(productId, newQuantity)
            .then((res) => {
                // Update the cart state with the new cart data from the response
                setCart(res.cart);
            })
            .catch((err) => console.error("Error updating cart quantity:", err));
    };

    // Handle showing fewer cart items
    const handleCartSeeLess = () => setCartVisible(5);

    // Handle initiating the payment process
    const handlePay = () => {
        // This is a placeholder. In a real app, this would navigate to a checkout page
        // or trigger a payment modal/flow.
        alert('Proceed to payment and shipping selection.');
        // You would likely pass cart data to the next step here.
    };

    // Feedback Handlers

    // Handle submitting feedback for an order
    const handleFeedbackSubmit = (feedbackData) => {
        // Make an API call to submit the feedback
        axios.patch(`/api/orders/${feedbackData.orderId}/feedback`, {
            rating: feedbackData.rating,
            title: feedbackData.title,
            comments: feedbackData.comments,
        })
            .then(() => {
                // Update the feedbackByOrder state to mark this order as having feedback given
                setFeedbackByOrder(prev => ({
                    ...prev,
                    [feedbackData.orderId]: { ...feedbackData, given: true } // Mark as given
                }));
                // Optionally, refetch orders to update the UI
                // axios.get('/api/orders').then(res => setOrders(res.data)).catch(err => console.error("Error refetching orders:", err));
            })
            .catch((err) => console.error("Error submitting feedback:", err));

        // Close the feedback popup
        setFeedbackOrderId(null);
    };

    // Handle deleting feedback (placeholder - actual API call needed)
    const handleFeedbackDelete = (orderId) => {
        // In a real application, you would make an API call here to delete the feedback
        console.log(`Deleting feedback for order ${orderId}`);
        // Example API call (assuming a DELETE endpoint):
        // axios.delete(`/api/orders/${orderId}/feedback`)
        //   .then(() => {
        //     // Update state to remove the feedback entry
        //     setFeedbackByOrder(prev => {
        //       const updated = { ...prev };
        //       delete updated[orderId];
        //       return updated;
        //     });
        //   })
        //   .catch(err => console.error("Error deleting feedback:", err));

        // For now, just update the local state
        setFeedbackByOrder(prev => {
            const updated = { ...prev };
            delete updated[orderId];
            return updated;
        });
    };


    return (
        <div className="buyer-dashboard">
            <h2 className="buyer-dashboard__header">My Purchases</h2>

            {/* Quick links for navigation */}
            <div className="buyer-dashboard__quick-links">
                <a href="#wishlist-section" className="buyer-dashboard__quick-link">❤️ Wishlist</a>
                <a href="#cart-section" className="buyer-dashboard__quick-link">🛒 Cart</a>
                {/* Add more quick links as needed */}
            </div>

            {/* Orders Section */}
            <div className="buyer-dashboard__orders">
                {loadingOrders ? (
                    <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p className="buyer-dashboard__empty">
                        No orders found. Your past orders will appear here when available.
                    </p>
                ) : (
                    // Map over orders to display each one
                    orders.map(order => {
                        // Determine collage style based on the number of items in the order
                        const { containerSize, gridTemplateColumns } = getCollageStyle(order.items.length);
                        return (
                            <div key={order._id} className="order-card">
                                {/* Order Items Collage (Mini Images) */}
                                <div
                                    className="order-card__collage"
                                    style={{
                                        width: `${containerSize}px`,
                                        height: `${containerSize}px`,
                                        display: 'grid', // Use grid for collage layout
                                        gridTemplateColumns,
                                        gap: '2px', // Small gap between images
                                        overflow: 'hidden', // Hide overflow if images don't fit perfectly
                                        borderRadius: '8px', // Rounded corners for the collage container
                                    }}
                                >
                                    {/* Map over order items to display mini images */}
                                    {order.items.map((item, idx) => (
                                        <img
                                            key={idx}
                                            // Use getImageUrl helper for dynamic image source
                                            src={getImageUrl(item.image)}
                                            alt={item.name}
                                            className="order-card__mini-image"
                                            // Basic styling for mini images within the grid
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover', // Cover the grid area
                                            }}
                                            // Fallback for image loading errors
                                            onError={(e) => {
                                                e.target.onerror = null; // Prevent infinite loop
                                                e.target.src = '/assets/images/default-product.png'; // Fallback image
                                            }}
                                        />
                                    ))}
                                </div>
                                {/* Order Details */}
                                <div className="order-card__details">
                                    <h3 className="order-card__id">Order {order._id}</h3>
                                    <p className="order-card__items-names">
                                        {/* Display names of items in the order */}
                                        {order.items.map(item => item.name).join(', ')}
                                    </p>
                                    <p className="order-card__status">Status: {order.status}</p>
                                    <p className="order-card__date">
                                        {/* Format order date */}
                                        Date: {new Date(order.date).toLocaleDateString()}
                                    </p>
                                </div>
                                {/* Order Actions (Track, Feedback) */}
                                <div className="order-card__actions">
                                    <Button className="button--sm" onClick={() => alert(`Tracking order ${order._id}`)}>
                                        Track Order
                                    </Button>
                                    {/* Show feedback buttons only if order status is 'Delivered' */}
                                    {order.status === 'Delivered' && (
                                        <>
                                            {/* Check if feedback has already been given for this order */}
                                            {feedbackByOrder[order._id] ? (
                                                <>
                                                    {/* Button to edit feedback */}
                                                    <Button className="button--sm" onClick={() => setFeedbackOrderId(order._id)}>
                                                        Edit Feedback
                                                    </Button>
                                                    {/* Button to delete feedback */}
                                                    <Button className="button--sm" onClick={() => handleFeedbackDelete(order._id)}>
                                                        Delete Feedback
                                                    </Button>
                                                </>
                                            ) : (
                                                // Button to give feedback if not already given
                                                <Button className="button--sm button--green" onClick={() => setFeedbackOrderId(order._id)}>
                                                    Give Feedback
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Wishlist Section */}
            <section className="buyer-dashboard__wishlist" id="wishlist-section">
                <h2 className="buyer-dashboard__section-header">Wishlist</h2>
                {/* Render WishlistSection component, passing wishlist data and handlers */}
                {/* Check if wishlist data is loaded and has items */}
                {(!wishlist || !wishlist.items || wishlist.items.length === 0) ? (
                    <p className="buyer-dashboard__empty">Your wishlist is currently empty.</p>
                ) : (
                    <WishlistSection
                        items={wishlist} // Pass the wishlist object (containing the items array)
                        visibleCount={wishlistVisible}
                        onSeeMore={() => setWishlistVisible(wishlistVisible + 5)}
                        onSeeLess={wishlistVisible > 5 ? handleWishlistSeeLess : null} // Only provide seeLess handler if needed
                        onRemove={handleRemoveWishlist}
                        onMoveToCart={handleMoveToCart}
                    />
                )}
            </section>

            {/* Cart Section */}
            <section className="buyer-dashboard__cart" id="cart-section">
                <h2 className="buyer-dashboard__section-header">Cart</h2>
                {/* Render CartSection component, passing cart data and handlers */}
                {/* Check if cart data is loaded and has items */}
                {cart.items.length === 0 ? (
                    <p className="buyer-dashboard__empty">Your cart is currently empty.</p>
                ) : (
                    <CartSection
                        items={cart} // Pass the cart object (containing the items array)
                        visibleCount={cartVisible}
                        onSeeMore={() => setCartVisible(cartVisible + 5)}
                        onSeeLess={cartVisible > 5 ? handleCartSeeLess : null} // Only provide seeLess handler if needed
                        onRemove={handleRemoveCart}
                        onUpdateQuantity={handleUpdateQuantity}
                        onPay={handlePay}
                    />
                )}
            </section>

            {/* Feedback Popup */}
            {feedbackOrderId && (
                <FeedbackPopup
                    orderId={feedbackOrderId}
                    initialFeedback={feedbackByOrder[feedbackOrderId] || null} // Pass existing feedback data if available
                    closePopup={() => setFeedbackOrderId(null)} // Function to close the popup
                    onSubmitFeedback={handleFeedbackSubmit} // Function to handle feedback submission
                />
            )}
        </div>
    );
};

export default BuyerDashboard;
