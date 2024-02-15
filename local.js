const { Client, Axios, Qrcode, LocalAuth } = require('./index');

//const axios = require('axios');
//const qrcode = require('qrcode-terminal');

console.log('Iniciou');

const client = new Client({
  authStrategy: new LocalAuth(),
  // proxyAuthentication: { username: 'username', password: 'password' },
  //puppeteer: { 
  // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
  //headless: false
  //}
});

// const { Client } = require('whatsapp-web.js');
// const client = new Client();

// client.on('qr', (qr) => {
//   console.log('QR Recebido', qr);
// });

client.on('qr', (qr) => {
  Qrcode.generate(qr, { small: true });
});

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
  console.log(message.body);
});

// Data Atual
const data_atual = new Date().toLocaleString();
const dia_atual = new Date().getDay(); //4 = Quinta / 5 = Sexta

// Your message.
const text = "Hey Lary";

// Getting chatId from the number.
// we have to delete "+" from the beginning and add "@c.us" at the end of the number.
const chatId = "120363236388884615@g.us";

// Sending message.
//client.sendMessage(chatId, text);


//Seleciona a mensagem pra responder
client.on('message', async (message) => {

  // Sending message.
  //client.sendMessage(chatId, text);

  if (parseInt(dia_atual) == parseInt(5)) {
    try {
      const response = await Axios.get('http://meufinanceiro/API/get_escala');
      //await client.sendMessage(message.from, response.data.data);
      await client.sendMessage(chatId, response.data.data);
      //console.log('Resposta:', response.data.data);
    } catch (error) {
      //await client.sendMessage(message.from, 'Ocorreu um erro ao tentar realizar sua solicitação!');
      console.error('Erro na requisição:', error.message);
    }
  }

  if (message.body === '!ping') {
    await message.reply('pong');
  }

  if (message.body.startsWith('!echo ')) {
    // Replies with the same message
    message.reply(message.body.slice(6));
  }

  if (message.body === '!escala') {
    try {
      const response = await Axios.get('http://meufinanceiro/API/get_escala');
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