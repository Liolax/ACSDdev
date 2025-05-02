
import mongoose from 'mongoose';
import Order from '../models/OrderModel.js';
import Cart from '../models/CartModel.js'; // Add this import

/**
 * Creates an order from cart items and shipping details (called during checkout).
 * Expects request body: { cartItems, shippingInfo }
 */
export const createOrder = async (req, res) => {
  try {
    // --- Add debug logs ---
    console.log('--- Order Creation Start ---');
    console.log('User ID from middleware:', req.user?._id);
    console.log('User Role from middleware:', req.user?.role);

    const userId = req.user._id; // Set by auth middleware
    const { cartItems, shippingInfo, paymentInfo, cartId } = req.body;

    console.log('User creating order:', userId);
    console.log('cartId from request:', cartId);

    let itemsToOrder = cartItems;
    // If cartItems is missing or empty, fetch from DB as fallback
    if (!itemsToOrder || !Array.isArray(itemsToOrder) || itemsToOrder.length === 0) {
      const cart = await Cart.findOne({ userId }).lean();
      console.log('Cart fetched in orderController:', JSON.stringify(cart));
      if (cart && cart.items && cart.items.length > 0) {
        console.log('Cart has items, proceeding to create order.');
      } else {
        console.error('Cart is empty or null in orderController. Throwing error.');
        return res.status(400).json({ message: 'Cannot create an order with an empty cart.' });
      }
      itemsToOrder = cart.items;
    }

    if (!shippingInfo || Object.keys(shippingInfo).length === 0) {
      return res.status(400).json({ message: 'Shipping information is required.' });
    }
    if (!itemsToOrder || !Array.isArray(itemsToOrder) || itemsToOrder.length === 0) {
      return res.status(400).json({ message: 'Cannot create an order with an empty cart.' });
    }

    // Calculate total amount
    const totalAmount = itemsToOrder.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    // Construct order items. Expect each cart item is an object containing product details.
    const orderItems = itemsToOrder.map(item => ({
      productId: item.product?._id ? item.product._id : item.productId,
      name: item.product?.name ? item.product.name : item.name,
      price: item.product?.price ? item.product.price : item.price,
      quantity: item.quantity,
      image: item.product?.imageUrl ? item.product.imageUrl : item.image,
    }));

    const newOrder = new Order({
      userId,
      cartId,
      items: orderItems,
      shippingInfo,
      totalAmount,
      status: 'Pending', // Initial status before payment simulation
      paymentStatus: 'Pending',
      paymentInfo: paymentInfo || {}
    });

    await newOrder.save();

    // Return in the structure expected by the frontend.
    res.status(201).json({ order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message || "Failed to create order" });
  }
};

/**
 * Simulates payment for an order.
 * Expects request body: { paymentDetails } where paymentDetails.method is required.
 * Updates order.paymentStatus and order.status.
 */
export const simulatePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    const { paymentDetails } = req.body;

    if (!paymentDetails || !paymentDetails.cardNumber || !paymentDetails.cardNumber.trim()) {
      return res.status(400).json({ message: 'Card number is required for payment simulation.' });
    }

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found or access denied.' });
    }
    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'Order has already been paid.' });
    }

    order.paymentStatus = 'Paid';
    order.status = 'Processing'; // Now the order is processing
    order.paymentInfo = paymentDetails;

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error("Error simulating payment:", error);
    res.status(500).json({ message: error.message || "Payment simulation failed" });
  }
};

/**
 * Retrieves orders (purchases) for the logged-in buyer.
 */
export const getMyPurchases = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    res.status(500).json({ message: error.message || "Failed to fetch your orders" });
  }
};

/**
 * Retrieves orders that contain products sold by the logged-in seller.
 * Assumes the Product model has a sellerId field.
 */
export const getMySales = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Get the seller's products
    const sellerProducts = await mongoose.model('Product').find({ sellerId }).select('_id');
    const sellerProductIds = sellerProducts.map(p => p._id);

    if (sellerProductIds.length === 0) {
      return res.status(200).json([]);
    }

    // Find orders where any item matches sellerProductIds.
    const sales = await Order.find({ 'items.productId': { $in: sellerProductIds } })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching seller sales:", error);
    res.status(500).json({ message: error.message || "Failed to fetch your sales data" });
  }
};

/**
 * Marks an order as shipped (seller action).
 * Expects order with status 'Processing' to be updated to 'Shipped'.
 */
export const markShipped = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    if (order.status !== 'Processing') {
      return res.status(400).json({ message: `Order status is ${order.status}, cannot mark as shipped.` });
    }
    order.status = 'Shipped';
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error("Error marking order as shipped:", error);
    res.status(500).json({ message: error.message || "Failed to mark order as shipped" });
  }
};

/**
 * Marks an order as delivered (buyer action).
 * Expects order with status 'Shipped' to be updated to 'Delivered'.
 */
export const markDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found or access denied." });
    }
    if (order.status !== 'Shipped') {
      return res.status(400).json({ message: `Order status is ${order.status}, cannot mark as delivered.` });
    }
    order.status = 'Delivered';
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error("Error marking order as delivered:", error);
    res.status(500).json({ message: error.message || "Failed to mark order as delivered" });
  }
};
