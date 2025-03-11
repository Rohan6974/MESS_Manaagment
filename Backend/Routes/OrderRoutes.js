const express = require('express');
const { placeOrder, getOrders, verifyPayment, verifyAndExpireQRCode } = require("../Controller/OrderController");
const { verifyToken } = require('../Middleware/verifyToken');
//const { sendNotificationToAdmin } = require('../utils/notificationService');

const router = express.Router();

// // Middleware to check if the user is faculty and send notification
// const notifyIfFaculty = (req, res, next) => {
//     if (req.user.role === "faculty") {
//         sendNotificationToAdmin(req.user);
//     }
//     next();
// };

// Place an order (any registered user)
router.post('/place', verifyToken, placeOrder);

// Get orders (only faculty)
router.get('/', verifyToken, (req, res, next) => {
    if (req.user.role === "faculty") next();
    else res.status(401).json({ message: "Access Denied" });
}, getOrders);


// Verify payment and generate QR code
router.post('/payment/verify', verifyPayment);

// Verify and expire QR code
router.post('/qr/verify', verifyAndExpireQRCode);

module.exports = router;