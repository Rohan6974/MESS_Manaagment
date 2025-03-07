const Order = require('../models/Order');
const { generateQRCode } = require('../utils/qrCodeGenerator');
const { verifyPaymentStatus } = require('../utils/paymentService');

// Place an order
const placeOrder = async (req, res) => {
    try {
        const newOrder = new Order({
            userId: req.user.id,
            items: req.body.items,
            totalAmount: req.body.totalAmount,

        });
        const savedOrder = await newOrder.save();
        const qrCode = await generateQRCode(savedOrder._id);

        res.status(201).json({ order: savedOrder, qrCode });
    } catch (error) {
        res.status(500).json({ message: 'Failed to place order', error });
    }
};

// Get orders (only for faculty)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get orders', error });
    }
};

// Create an order for payment
const createOrder = async (req, res) => {
    try {
        const newOrder = new Order({
            userId: req.user.id,
            items: req.body.items,
            totalAmount: req.body.totalAmount,
            status: 'Pending'
        });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create order', error });
    }
};

// Verify payment and generate QR code
const verifyPayment = async (req, res) => {
    try {
        const { orderId, paymentDetails } = req.body;
        const isPaymentValid = await verifyPaymentStatus(paymentDetails);

        if (isPaymentValid) {
            const order = await Order.findById(orderId);
            order.status = 'Paid';
            await order.save();

            const qrCode = await generateQRCode(orderId);
            res.status(200).json({ message: 'Payment verified', qrCode });
        } else {
            res.status(400).json({ message: 'Invalid payment details' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to verify payment', error });
    }
};

// Verify and expire QR code
const verifyAndExpireQRCode = async (req, res) => {
    try {
        const { qrCode } = req.body;
        const orderId = await verifyQRCode(qrCode);

        if (orderId) {
            const order = await Order.findById(orderId);
            if (order && order.status === 'Paid') {
                order.status = 'Completed';
                await order.save();
                res.status(200).json({ message: 'QR code verified and order completed' });
            } else {
                res.status(400).json({ message: 'Invalid or expired QR code' });
            }
        } else {
            res.status(400).json({ message: 'Invalid QR code' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to verify QR code', error });
    }
};

module.exports = {
    placeOrder,
    getOrders,
    createOrder,
    verifyPayment
};