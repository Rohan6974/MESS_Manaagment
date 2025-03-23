const DeanAndHOD = require('../Schemas/DeanAndHOD');
const Order= require('../Schemas/Order');
const Razorpay = require('razorpay');
const QRCode = require('qrcode'); // Directly using the qrcode package
const crypto = require('crypto');
const {v4: uuidv4} = require('uuid');
// Razorpay instance
const razorpay = new Razorpay({
    key_id: "rzp_test_g3ezQExpMD4bv6",
    key_secret: "mI2uV0FAHVv1mVVZ7PxUIXot",
  });

// Create a new meal order
exports.createOrder = async (req, res) => {
    try {
        const { amount, role } = req.body;

        // If the user is a dean or HOD, skip payment and QR generation
        if (role === DeanAndHOD ) {
            return res.status(200).json({ message: 'Order placed successfully. No QR required.' });
        }

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.send({ orderId: order.id });
        res.status(200).json({ orderId: order.id, amount: options.amount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// Verify payment and generate QR code
exports.verifyPayment = async (req, res) => {
  const { orderId, paymentId, signature, ticketDetails } = req.body;

  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", razorpay.key_secret)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === signature) {
    try {
      const qrCodeData = await QRCode.toDataURL(JSON.stringify(ticketDetails));

      // Save order details to the database
      const order = new Order({
        orderId,
        paymentId,
        ticketDetails,
        qrCode: qrCodeData,
        status: "Paid",
      });

      await order.save();

      res.send({ success: true, qrCode: qrCodeData });
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  } else {
    res.send({ success: false, message: "Invalid signature" });
  }
};

