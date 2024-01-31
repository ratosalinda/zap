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
  console.log('Client is ready!');
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
    await fazerRequisicao();
  }
});

//Não seleciona a mensagem pra responder
client.on('message', async (message) => {
  if (message.body === '!escala') {
    await client.sendMessage(message.from, 'Falha no carregamento!');
  }
});

const axios = require('axios');

async function fazerRequisicao() {
  try {
    const response = await axios.get('http://apibank.veredastecnologia/main/get_teste');
    console.log('Sucesso na requisição', response.data);

    client.on('message', async (message) => {
      if (message.body === '!escala') {
        await client.sendMessage(message.from, response.data);
      }
    });

  } catch (error) {

    client.on('message', async (message) => {
      if (message.body === '!escala') {
        await client.sendMessage(message.from, 'Ocorreu um problema ao realizar a operação!');
      }
    });

    console.error('Erro na requisição:', error.message);

  }
}

// Chame a função para fazer a requisição
//fazerRequisicao();

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
