import React, { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

const Payment = () => {
  const [ticket, setTicket] = useState({
    name: "",
    email: "",
    mealType: "Lunch",
    quantity: 1,
    amount: 70, // ₹70 per ticket
  });

  const [qrData, setQrData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const UserInfo = localStorage.getItem("user");
    if (UserInfo) {
      setUser(JSON.parse(UserInfo));
    }
  }, []);

  const handleChange = (e) => {
    setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log("Razorpay SDK loaded successfully");
        resolve(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      alert(
        "Failed to load Razorpay SDK. Please check your internet connection."
      );
      return;
    }

    if (!user) {
      alert("User information not found. Please log in again.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/order/order",
        {
          amount: ticket.amount * ticket.quantity,
          currency: "INR",
          receipt: "receipt#1",
        }
      );
      console.log("Order created successfully:", data);
      const options = {
        key: "rzp_test_g3ezQExpMD4bv6", // Replace with Razorpay Key ID
        amount: ticket.amount * ticket.quantity * 100,
        currency: "INR",
        name: "Meal Ticket",
        description: "Lunch Ticket Purchase",
        order_id: data.orderId,

        handler: async (response) => {
          const verifyRes = await axios.post(
            "http://localhost:5000/api/order/payment/verify",
            {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              facultyId: user._id,
              facultyName: user.name,
              ticketDetails: {
                ...ticket,
                amount: ticket.amount * ticket.quantity,
              },
            }
          );

          setQrData(verifyRes.data.qrCode);
        },
        prefill: {
          name: ticket.name,
          email: ticket.email,
        },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error processing payment", error);
      alert("Error processing payment. Please try again.");
    }
  };

  return (
    <div className="payment-container">
      <h2>Purchase Meal Ticket</h2>
      <select name="mealType" value={ticket.mealType} onChange={handleChange}>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
      </select>

      <input
        type="number"
        name="quantity"
        value={ticket.quantity}
        onChange={handleChange}
        min="1"
      />
      <p>Total Amount: ₹{ticket.amount * ticket.quantity}</p>

      <button className="pay-now-btn" onClick={handlePayment}>
        Pay Now
      </button>

      {qrData && (
        <div>
          <h3>QR Code Ticket</h3>
          <QRCodeCanvas value={qrData} size={200} />
        </div>
      )}
    </div>
  );
};

export default Payment;