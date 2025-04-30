import mongoose from 'mongoose';
import Order from '../models/OrderModel.js';

/**
 * Creates an order from cart items and shipping details (called during checkout).
 * Expects request body: { cartItems, shippingDetails }
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id; // Added by auth middleware
    const { cartItems, shippingDetails } = req.body;

    if (!shippingDetails || Object.keys(shippingDetails).length === 0) {
      return res.status(400).json({ message: 'Shipping information is required.' });
    }
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cannot create an order with an empty cart.' });
    }

    // Securely calculate total amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Construct order items (assuming each cart item has a populated product)
    const orderItems = cartItems.map(item => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.imageUrl, // Store URL at time of purchase
    }));

    const newOrder = new Order({
      userId,
      items: orderItems,
      shippingInfo: shippingDetails,
      totalAmount,
      status: 'Pending', // Before payment simulation
      paymentStatus: 'Pending',
    });

    await newOrder.save();

    // Optionally: clear user's cart here.
    res.status(201).json(newOrder);
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

    if (!paymentDetails || !paymentDetails.method) {
      return res.status(400).json({ message: 'Payment method details are required for simulation.' });
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

    // Retrieve seller's products and extract their IDs.
    const sellerProducts = await mongoose.model('Product')
      .find({ sellerId }).select('_id');
    const sellerProductIds = sellerProducts.map(p => p._id);

    if (sellerProductIds.length === 0) {
      return res.status(200).json([]);
    }

    // Find orders where at least one item matches sellerProductIds.
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
    // (Optional) Verify that the seller owns at least one product in the order.
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
