const axios = require('axios');

const sendSMS = async (phoneNumber, message) => {
  try {
    const apiKey = process.env.MSG91_API_KEY;
    const response = await axios.get('https://api.msg91.com/api/sendhttp.php', {
      params: {
        authkey: apiKey,
        mobiles: phoneNumber,
        message: message,
        sender: 'WINGRW', // Set your MSG 91 approved sender ID
        route: 4,
        country: 91
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

module.exports = sendSMS;
