import Order from '../models/OrderModel.js';

// Create a new order (checkout)
export const createOrder = async (req, res) => {
  try {
    const user = req.user;
    const { cartId, items, shippingInfo, paymentInfo } = req.body;

    // Validate required fields.
    if (!shippingInfo || Object.keys(shippingInfo).length === 0) {
      return res.status(400).json({ success: false, error: 'Shipping information is required.' });
    }
    if (!paymentInfo || Object.keys(paymentInfo).length === 0) {
      return res.status(400).json({ success: false, error: 'Payment information is required.' });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart items are required.' });
    }
    
    const newOrder = new Order({
      userId: user._id,
      cartId,
      items,
      shippingInfo,
      paymentInfo,
      status: 'Processing',
      paymentStatus: 'Pending'
    });
    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to create order" });
  }
};

// Simulate payment for an order
export const simulatePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { cardNumber, expiry, cvv } = req.body;
    // Dummy simulation: require a card number to simulate success.
    if (!cardNumber) {
      return res.status(400).json({ success: false, error: 'Card number is required for payment simulation.' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    order.paymentStatus = 'Paid';
    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error simulating payment:", error);
    res.status(500).json({ success: false, error: error.message || "Payment simulation failed" });
  }
};

// Stub: Get all orders (for now, just return an empty list)
export const getAllOrders = async (req, res) => {
  try {
    res.status(200).json({ success: true, orders: [] });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch orders" });
  }
};

// Stub: Get sales data (for now, just return an empty list)
export const getSales = async (req, res) => {
  try {
    res.status(200).json({ success: true, sales: [] });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to fetch sales" });
  }
};

// Stub: Mark an order as shipped
export const markShipped = async (req, res) => {
  try {
    // Here you would normally update the order status.
    res.status(200).json({ success: true, message: "Order marked as shipped" });
  } catch (error) {
    console.error("Error marking order as shipped:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to mark order as shipped" });
  }
};

// Stub: Mark an order as delivered
export const markDelivered = async (req, res) => {
  try {
    // Here you would normally update the order status.
    res.status(200).json({ success: true, message: "Order marked as delivered" });
  } catch (error) {
    console.error("Error marking order as delivered:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to mark order as delivered" });
  }
};

// Stub: Add feedback for an order
export const addFeedback = async (req, res) => {
  try {
    // Here you would normally record feedback.
    res.status(200).json({ success: true, message: "Feedback added" });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to add feedback" });
  }
};
