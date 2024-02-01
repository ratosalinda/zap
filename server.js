const axios = require('axios');
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3030;

const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', (qr) => {
    console.log('QR Recebido', qr);
});

// client.on('qr', (qr) => {
//   qrcode.generate(qr, { small: true });
// });

client.on('ready', () => {
  console.log('Cliente pronto!');
});

client.initialize();

client.on('message', (message) => {
console.log(message.body);
});

//Seleciona a mensagem pra responder
client.on('message', async (message) => {
if (message.body === '!ping') {
  await message.reply('pong');
}

  if (message.body === '!consulta') {
      try {
          const response = await axios.get('https://newfinanceiro.mdbgo.io/API/get_escala');
          await client.sendMessage(message.from, response.data.message);
          console.log('Resposta:', response.data.message);
      } catch (error) {
          await client.sendMessage(message.from, 'Ocorreu um erro ao tentar realizar sua solicitação!');
          console.error('Erro na requisição:', error.message);
      }
  }
});

//Não seleciona a mensagem pra responder
client.on('message', async (message) => {
if (message.body === '!escala') {
  await client.sendMessage(message.from, 'Falha no carregamento da escala!');
}
});

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
