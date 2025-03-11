require('dotenv').config();

module.exports = {
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  recipientPhoneNumber: process.env.RECIPIENT_PHONE_NUMBER
};
