const { google } = require('googleapis');
const { readFileSync } = require('fs');
const path = require('path');

// Load the service account key from the JSON file
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../credentials/service_account.json'), // Adjust the path as needed
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

// Function to get the Google Sheets client
const getSheetsClient = async () => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  return sheets;
};

module.exports = getSheetsClient;
