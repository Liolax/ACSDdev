import Order from '../models/OrderModel.js';

// Get all orders for current user (buyer)
export async function getOrders(req, res) {
  try {
    const buyerId = req.user?._id || req.query.buyerId; // adapt 
    const orders = await Order.find({ buyerId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
}

// Create order (set status to Processing)
export async function createOrder(req, res) {
  try {
    const { buyerId, items, shippingDetails } = req.body;
    const order = new Order({
      buyerId,
      items,
      shippingDetails,
      status: 'Processing',
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
}

// Seller confirms shipping (set status to Shipped)
export async function markShipped(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(
      id,
      { status: 'Shipped' },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
}

// Buyer confirms delivery (set status to Delivered)
export async function markDelivered(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(
      id,
      { status: 'Delivered' },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
}

// Attach feedback to order (after delivered)
export async function addFeedback(req, res) {
  try {
    const { id } = req.params;
    const { rating, title, comments } = req.body;
    const order = await Order.findByIdAndUpdate(
      id,
      { feedback: { rating, title, comments, given: true } },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save feedback' });
  }
}

// Seller: Get all sales for current seller (products they sold)
export async function getSales(req, res) {
  try {
    // Assume req.user._id is sellerId
    const sellerId = req.user?._id;
    const orders = await Order.find({ 'items.sellerId': sellerId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sales' });
  }
}