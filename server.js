const { Client, Axios, LocalAuth } = require('./index');

//const axios = require('axios');
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3030;

console.log('Iniciou');

const wwebVersion = '2.2407.3';

const client = new Client({
  authStrategy: new LocalAuth(), // your authstrategy here
  puppeteer: {
    headless: true , args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  webVersionCache: {
      type: 'remote',
      remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
  },
});

// const { Client } = require('whatsapp-web.js');
// const client = new Client();

client.on('qr', (qr) => {
  console.log('QR Recebido', qr);
});

// client.on('qr', (qr) => {
//   Qrcode.generate(qr, { small: true });
// });

client.on('authenticated', () => {
  console.log('QrCode já autenticado!');
});

client.on('auth_failure', message => {
  // Fired if session restore was unsuccessful
  console.error('Falha ao autenticar o QrCode!', message);
});

client.on('ready', () => {
  console.log('Aplicação pronta!');
});

client.initialize();

client.on('message', (message) => {
  //console.log(message.body);
  console.log(message.from + ': ' + message.body);
});

//Seleciona a mensagem pra responder
client.on('message', async (message) => {
  if (message.body === '!ping') {
    await message.reply('pong');
  }

  if (message.body === '!escala') {
    try {
      const response = await Axios.get('https://newfinanceiro.mdbgo.io/API/get_escala');
      await client.sendMessage(message.from, response.data.data);
      console.log('Resposta:', response.data.data);
    } catch (error) {
      await client.sendMessage(message.from, 'Ocorreu um erro ao tentar realizar sua solicitação!');
      console.error('Erro na requisição:', error.message);
    }
  }
});

//Não seleciona a mensagem pra responder
client.on('message', async (message) => {
  if (message.body === '!consulta') {
    await client.sendMessage(message.from, 'Falha no carregamento da consulta!');
  }
});

// app.listen(PORT, () => {
//   console.log(`Servidor executando na porta ${PORT}`);
// });
