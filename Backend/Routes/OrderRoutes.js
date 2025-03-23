const express = require('express');
const { createOrder, verifyPayment } = require("../Controller/OrderController");
//const { verifyToken } = require('../Middleware/verifyToken');

const router = express.Router();

// // Place an order
// router.post('/place', verifyToken, (req, res, next) => {
//     console.log(req.user);
//     if (req.user.role === "faculty") next();
//     else res.status(401).json({ message: "Access Denied" });
// }, placeOrder);

// // Get orders
// router.get('/', verifyToken, (req, res, next) => {
//     console.log(req.user.role);
//     if (req.user.role === "faculty") next();
//     else res.status(401).json({ message: "Access Denied" });
// }, getOrders);

// Create an order for payment
router.post('/order', createOrder);

// Verify payment and generate QR code
router.post('/payment/verify', verifyPayment);

module.exports = router;