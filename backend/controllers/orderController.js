import mongoose from 'mongoose';
import Order from '../models/OrderModel.js';
import Cart from '../models/CartModel.js';
import Product from '../models/ProductModel.js';

// Create order (buyer checkout)
export const createOrder = async (req, res) => {
  try {
    const buyer = req.user._id;
    const { shippingInfo, paymentInfo } = req.body;
    const cart = await Cart.findOne({ userId: buyer }).lean();
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cannot create an order with an empty cart.' });
    }
    let itemsPrice = 0;
    const orderItems = await Promise.all(cart.items.map(async item => {
      const product = await Product.findById(item.productId);
      let priceNum = Number(item.price);
      if (isNaN(priceNum)) priceNum = 0;
      const qty = Number(item.quantity) || 1;
      itemsPrice += priceNum * qty;
      return {
        productId: item.productId,
        name: item.name,
        price: priceNum.toFixed(2),
        qty,
        image: item.image,
        seller: product.seller,
        status: 'Processing', // Each item starts as Processing
        feedback: null
      };
    }));
    const taxPrice = itemsPrice * 0.1;
    const shippingPrice = 5;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    const orderData = {
      buyer,
      cartId: cart._id,
      orderItems,
      shippingAddress: shippingInfo,
      paymentInfo: paymentInfo || {},
      itemsPrice: itemsPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
      isPaid: false,
      isDelivered: false,
      status: 'Pending', // Order starts as Pending
      paymentStatus: 'Pending'
    };
    const newOrder = new Order(orderData);
    await newOrder.save();
    res.status(201).json({ order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create order" });
  }
};

// Simulate payment (buyer pays)
export const simulatePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const buyerId = req.user._id;
    const { paymentDetails } = req.body;
    if (!paymentDetails || !paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
      return res.status(400).json({ message: 'Payment details required.' });
    }
    const order = await Order.findOne({ _id: orderId, buyer: buyerId });
    if (!order) return res.status(404).json({ message: 'Order not found or access denied.' });
    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'Order has already been paid.' });
    }
    order.paymentStatus = 'Paid';
    order.status = 'Processing'; // Order moves to Processing after payment
    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();
    // Clear cart
    const cart = await Cart.findOne({ userId: buyerId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || "Payment simulation failed" });
  }
};

// Get buyer's purchases
export const getMyPurchases = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const orders = await Order.find({ buyer: buyerId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch your orders" });
  }
};

// Get seller's sales (all items sold by this seller)
export const getMySales = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ 'orderItems.seller': sellerId })
      .populate('orderItems.productId')
      .populate('orderItems.feedback.buyer', 'name');
    // Only seller's items
    const result = [];
    orders.forEach(order => {
      const items = order.orderItems.filter(i => i.seller.equals(sellerId));
      if (items.length) result.push({ ...order.toObject(), orderItems: items });
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get orders to ship (seller, only their items with status Processing)
export const getOrdersToShip = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ 'orderItems.seller': sellerId, 'orderItems.status': 'Processing' })
      .populate('orderItems.productId');
    const result = [];
    orders.forEach(order => {
      const items = order.orderItems.filter(i => i.seller.equals(sellerId) && i.status === 'Processing');
      if (items.length) result.push({ ...order.toObject(), orderItems: items });
    });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Return all order items sold by this seller (flattened, with orderId)
export const getMySalesItems = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ 'orderItems.seller': sellerId }).sort({ createdAt: -1 });
    // Flatten all orderItems for this seller, attach orderId and createdAt
    const items = [];
    orders.forEach(order => {
      (order.orderItems || []).forEach(item => {
        if (item.seller.equals(sellerId)) {
          items.push({
            ...item.toObject(),
            orderId: order._id,
            createdAt: order.createdAt
          });
        }
      });
    });
    res.json(items);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Return all order items to ship for this seller (flattened, with orderId)
export const getOrderItemsToShip = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ 'orderItems.seller': sellerId, 'orderItems.status': 'Processing' }).sort({ createdAt: -1 });
    const items = [];
    orders.forEach(order => {
      (order.orderItems || []).forEach(item => {
        if (item.seller.equals(sellerId) && item.status === 'Processing') {
          items.push({
            ...item.toObject(),
            orderId: order._id,
            createdAt: order.createdAt
          });
        }
      });
    });
    res.json(items);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Seller marks item as shipped
export const markShipped = async (req, res) => {
  try {
    const { orderId, orderItemId } = req.body;
    const sellerId = req.user._id;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const item = order.orderItems.id(orderItemId);
    if (!item) return res.status(404).json({ error: 'Order item not found' });
    if (!item.seller.equals(sellerId)) return res.status(403).json({ error: 'Unauthorized' });
    if (item.status !== 'Processing') return res.status(400).json({ error: 'Item not in Processing status' });
    item.status = 'Shipped'; // Only Processing -> Shipped
    await order.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Buyer marks item as delivered
export const markDelivered = async (req, res) => {
  try {
    const { orderId, orderItemId } = req.body;
    const buyerId = req.user._id;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!order.buyer.equals(buyerId)) return res.status(403).json({ error: 'Unauthorized' });
    const item = order.orderItems.id(orderItemId);
    if (!item) return res.status(404).json({ error: 'Order item not found' });
    if (item.status !== 'Shipped') return res.status(400).json({ error: 'Item not in Shipped status' });
    item.status = 'Delivered'; // Only Shipped -> Delivered
    await order.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Buyer leaves feedback for delivered item
export const addFeedback = async (req, res) => {
  try {
    const { orderId, orderItemId, rating, title, comments } = req.body;
    const buyerId = req.user._id;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const item = order.orderItems.id(orderItemId);
    if (!item) return res.status(404).json({ error: 'Order item not found' });
    if (!order.buyer.equals(buyerId) || item.status !== 'Delivered')
      return res.status(403).json({ error: 'Unauthorized or not delivered' });
    item.feedback = { rating, title, comments, buyer: buyerId };
    await order.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Buyer edits feedback for delivered item
export const editFeedback = async (req, res) => {
  try {
    const { orderId, orderItemId, rating, title, comments } = req.body;
    const buyerId = req.user._id;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const item = order.orderItems.id(orderItemId);
    if (!item) return res.status(404).json({ error: 'Order item not found' });
    if (!order.buyer.equals(buyerId) || item.status !== 'Delivered')
      return res.status(403).json({ error: 'Unauthorized or not delivered' });
    if (!item.feedback) return res.status(400).json({ error: 'No feedback to edit' });
    item.feedback = { rating, title, comments, buyer: buyerId, edited: true };
    await order.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Buyer deletes feedback for delivered item
export const deleteFeedback = async (req, res) => {
  try {
    const { orderId, orderItemId } = req.body;
    const buyerId = req.user._id;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const item = order.orderItems.id(orderItemId);
    if (!item) return res.status(404).json({ error: 'Order item not found' });
    if (!order.buyer.equals(buyerId) || item.status !== 'Delivered')
      return res.status(403).json({ error: 'Unauthorized or not delivered' });
    item.feedback = null;
    await order.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
