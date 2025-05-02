import Cart from '../models/CartModel.js';

// Get the user's cart (with product details populated)
export const getCart = async (req, res) => {
    try {
        const user = req.user; // Using our authenticated user
        let cart = await Cart.findOne({ userId: user._id }).populate('items.productId');
        if (!cart) {
            // Auto-create an empty cart for the user if not found
            cart = new Cart({ userId: user._id, items: [] });
            await cart.save();
        }
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Add a product to the user's cart.
export const addToCart = async (req, res) => {
    try {
        const user = req.user; // Ensure the user is authenticated
        let { productId, quantity, name, price, image } = req.body;

        // Convert quantity and price to numbers.
        quantity = Number(quantity);
        price = Number(price); // Ensure price is a number

        // Validate required fields.
        if (!productId || !quantity || !name || Number.isNaN(price)) {
            return res
                .status(400)
                .json({ success: false, error: 'Missing or invalid product details' });
        }

        // Convert price to string for Decimal128 compatibility
        price = price.toString();

        // Find existing cart for the user. If none, create a new one.
        let cart = await Cart.findOne({ userId: user._id });
        if (!cart) {
            cart = new Cart({ userId: user._id, items: [] });
        }

        // Check if the product already exists in the cart.
        const index = cart.items.findIndex(
            item => item.productId.toString() === productId
        );
        if (index !== -1) {
            // Increase quantity if the product is already in the cart.
            cart.items[index].quantity += quantity;
        } else {
            cart.items.push({ productId, name, price, image, quantity });
        }

        await cart.save();
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update an existing cart item's quantity.
export const updateCartItem = async (req, res) => {
    try {
        const user = req.user;
        const { productId } = req.params;
        const { quantity: newQuantity } = req.body;
        let cart = await Cart.findOne({ userId: user._id });
        if (!cart) {
            return res.status(404).json({ success: false, error: 'Cart not found' });
        }
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res
                .status(404)
                .json({ success: false, error: 'Product not found in cart' });
        }

        cart.items[itemIndex].quantity = newQuantity;
        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Remove a product from the user's cart.
export const removeFromCart = async (req, res) => {
    try {
        const user = req.user;
        const { productId } = req.params;
        let cart = await Cart.findOne({ userId: user._id });
        if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Clear all items from the user's cart.
export const clearCart = async (req, res) => {
    try {
        const user = req.user;
        let cart = await Cart.findOne({ userId: user._id });
        if (!cart) {
            return res
                .status(404)
                .json({ success: false, error: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
