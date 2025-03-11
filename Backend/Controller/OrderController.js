const Order = require("../Schemas/Order");
//const { generateQRCode, verifyQRCode } = require('../utils/qrCodeGenerator');
//const { verifyPaymentStatus } = require('../utils/paymentService');
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: "rzp_test_g3ezQExpMD4bv6",
  key_secret: "mI2uV0FAHVv1mVVZ7PxUIXot",
});

exports.placeOrder = async (req, res) => {
  try {
    const newOrder = new Order({
      userId: req.user.id,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to place order", error });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders", error });
  }
};

exports.verifyPayment = async (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", razorpay.key_secret)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === signature) {
    try {
      const order = await Order.findById(orderId);
      order.status = 'Paid';
      await order.save();

      const qrCode = await generateQRCode(orderId);
      res.status(200).json({ message: 'Payment verified', qrCode });
    } catch (error) {
      res.status(500).json({ message: 'Failed to verify payment', error });
    }
  } else {
    res.status(400).json({ message: 'Invalid payment details' });
  }
};

exports.verifyAndExpireQRCode = async (req, res) => {
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

