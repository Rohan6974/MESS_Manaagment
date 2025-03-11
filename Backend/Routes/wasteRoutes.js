const express = require('express');
const router = express.Router();
const Waste = require('../Schemas/Waste');
const twilio = require('twilio');

const client = new twilio("ACc898e331a4c7576e837edfb897f73c00", "642886cf65864e7af04847d5f4aa89fc");

// Store the latest quantity in memory (Temporary storage)
let latestQuantity = 0;

// Replace this with your actual ngrok URL


// API to log waste and trigger a call
router.post('/', async (req, res) => {
  try {
    const { quantity } = req.body;
    const universityName = "XYZ University"; // Hardcoded university name

    // Save waste details to database
    const newWaste = new Waste({ quantity });
    await newWaste.save();

    // Store the latest quantity (for TwiML response)
    latestQuantity = quantity;

    // Make automated call using ngrok URL
    const call = await client.calls.create({
      url: "http://localhost:9898/api/waste/twiml",
      to: "+19137044714",
      from: "+916352091654"
    });

    res.json({ message: 'Call initiated', callSid: call.sid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to generate TwiML XML (Twilio will request this)
router.get('/twiml', (req, res) => {
  const universityName = "XYZ University";

  // Ensure XML response is valid
  res.set('Content-Type', 'text/xml');
  res.send(`
    <Response>
      <Say voice="alice">
        This is an automated message from ${universityName}. 
        The available food quantity is ${latestQuantity} kilograms.
      </Say>
    </Response>
  `);
});

module.exports = router;
