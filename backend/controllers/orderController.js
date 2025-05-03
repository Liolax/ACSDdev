import mongoose from 'mongoose';
import Order from '../models/OrderModel.js';
import Cart from '../models/CartModel.js';

export const createOrder = async (req, res) => {
  try {
    console.log('--- Order Creation Start ---');
    const user = req.user._id;
    const { shippingInfo, paymentInfo } = req.body;

    // Always fetch cart from DB for security
    const cart = await Cart.findOne({ userId: user }).lean();
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cannot create an order with an empty cart.' });
    }

    // Calculate prices
    let itemsPrice = 0;
    const orderItems = cart.items.map(item => {
      let priceNum = item.price?.$numberDecimal
        ? parseFloat(item.price.$numberDecimal)
        : Number(item.price);
      if (isNaN(priceNum)) priceNum = 0;
      const qty = Number(item.quantity) || 1;
      itemsPrice += priceNum * qty;
      return {
        productId: item.productId,
        name: item.name,
        price: mongoose.Types.Decimal128.fromString(priceNum.toFixed(2)),
        qty,
        image: item.image,
      };
    });

    // Example: 10% tax and flat 5 shipping for demo
    const taxPrice = itemsPrice * 0.1;
    const shippingPrice = 5;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const orderData = {
      user,
      cartId: cart._id,
      orderItems,
      shippingAddress: shippingInfo,
      paymentInfo: paymentInfo || {},
      itemsPrice: mongoose.Types.Decimal128.fromString(itemsPrice.toFixed(2)),
      taxPrice: mongoose.Types.Decimal128.fromString(taxPrice.toFixed(2)),
      shippingPrice: mongoose.Types.Decimal128.fromString(shippingPrice.toFixed(2)),
      totalPrice: mongoose.Types.Decimal128.fromString(totalPrice.toFixed(2)),
      isPaid: false,
      isDelivered: false,
      status: 'Pending',
      paymentStatus: 'Pending'
    };

    console.log("Data being passed to new Order():", JSON.stringify(orderData, null, 2));

    const newOrder = new Order(orderData);
    await newOrder.save();

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
    // Log the incoming request body for debugging
    console.log("Received request body for payment simulation:", JSON.stringify(req.body, null, 2));
    const { paymentDetails } = req.body;

    // Basic validation for paymentDetails fields
    if (
      !paymentDetails ||
      !paymentDetails.cardNumber ||
      !paymentDetails.cardNumber.trim()
    ) {
      return res.status(400).json({ message: 'Card number is required for payment simulation.' });
    }
    if (
      !paymentDetails.expiry ||
      !/^\d{2,4}\/?\d{2,4}$/.test(paymentDetails.expiry.replace(/\s/g, ''))
    ) {
      return res.status(400).json({ message: 'Expiry date is required and must be in MM/YY or MMYYYY format.' });
    }
    if (
      !paymentDetails.cvv ||
      !/^\d{3,4}$/.test(paymentDetails.cvv)
    ) {
      return res.status(400).json({ message: 'CVV is required and must be 3 or 4 digits.' });
    }

    // Change userId to user if your model uses 'user'
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found or access denied.' });
    }
    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'Order has already been paid.' });
    }

    order.paymentStatus = 'Paid';
    order.status = 'Processing'; // Now the order is processing
    order.paymentInfo = paymentDetails;
    order.isPaid = true;
    order.paidAt = new Date();

    await order.save();

    // Clear the user's cart after successful payment
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

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
