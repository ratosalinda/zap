const express = require("express");
const app = express();
const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

const { Client } = require('whatsapp-web.js');
const client = new Client();

console.log('veio');

client.on('qr', (qr) => {
  console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.initialize();
