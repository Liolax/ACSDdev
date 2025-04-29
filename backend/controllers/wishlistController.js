import Wishlist from '../models/WishlistModel.js';
import Cart from '../models/CartModel.js';

// Get the user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const user = req.user;
        const wishlist = await Wishlist.findOne({ userId: user._id }).populate('items.productId');
        if (!wishlist) {
            return res.status(404).json({ success: false, message: 'Wishlist not found' });
        }
        res.status(200).json({ success: true, wishlist });
    } catch (error) {
        console.error('Error getting wishlist:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Add an item to the user's wishlist.
export const addToWishlist = async (req, res) => {
    try {
        const user = req.user;
        let { productId, name, price, image } = req.body;

        if (!productId || !name || isNaN(price)) {
            return res.status(400).json({ success: false, error: 'Missing or invalid product details' });
        }

        let wishlist = await Wishlist.findOne({ userId: user._id });
        if (!wishlist) {
            wishlist = new Wishlist({ userId: user._id, items: [] });
        } else {
            // Clean up invalid items (without name or price)
            wishlist.items = wishlist.items.filter(item => item.name && item.price !== undefined);
        }

        // Add item only if it does not exist already
        if (!wishlist.items.some(item => item.productId.toString() === productId)) {
            wishlist.items.push({ productId, name, price, image });
        }

        await wishlist.save();
        res.status(200).json({ success: true, wishlist });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Remove an item from the user's wishlist.
export const removeFromWishlist = async (req, res) => {
    try {
        const user = req.user;
        const { productId } = req.params;

        let wishlist = await Wishlist.findOne({ userId: user._id });
        if (!wishlist) return res.status(404).json({ success: false, error: 'Wishlist not found' });

        wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);

        await wishlist.save();
        res.status(200).json({ success: true, wishlist });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Move an item from the wishlist to the user's cart.
export const moveWishlistToCart = async (req, res) => {
    try {
        const user = req.user;
        const { productId } = req.params;

        let wishlist = await Wishlist.findOne({ userId: user._id });
        if (!wishlist) return res.status(404).json({ success: false, error: 'Wishlist not found' });

        const item = wishlist.items.find(item => item.productId.toString() === productId);
        if (!item) return res.status(404).json({ success: false, error: 'Item not found in wishlist' });

        // Get or create the user's cart
        let cart = await Cart.findOne({ userId: user._id });
        if (!cart) {
            cart = new Cart({ userId: user._id, items: [] });
        }

        if (!cart.items.some(cartItem => cartItem.productId.toString() === productId)) {
            cart.items.push({ productId, name: item.name, price: item.price, image: item.image, quantity: 1 });
        }

        await cart.save();
        wishlist.items = wishlist.items.filter(wItem => wItem.productId.toString() !== productId);
        await wishlist.save();

        res.status(200).json({ success: true, wishlist, cart });
    } catch (error) {
        console.error('Error moving wishlist item to cart:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
