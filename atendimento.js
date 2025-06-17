const { Client, Axios, Qrcode, LocalAuth } = require('./index');

//const axios = require('axios');
//const qrcode = require('qrcode-terminal');

console.log('Iniciou');

const client = new Client({
    authStrategy: new LocalAuth(),
    // proxyAuthentication: { username: 'username', password: 'password' },
    // puppeteer: { 
    // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
    // headless: false
    // }
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
    //console.log(message.body);
    console.log(message.from + ': ' + message.body);
});

// Sending message.
//client.sendMessage(chatId, text);

const session = {};

//Seleciona a mensagem pra responder
client.on('message', async (message) => {
    // if (message.body === '!ping') {
    //     await message.reply('pong');
    // }

    // if (message.body.startsWith('!echo ')) {
    //     // Replies with the same message
    //     message.reply(message.body.slice(6));
    // }

    const user = message.from;
    const msg = message.body.toLowerCase();

    if (!session[user]) {
        session[user] = { step: 0 };
    }

    switch (session[user].step) {
        case 0:
            message.reply('Olá! Como posso ajudar você hoje?\n\n1. Problemas Técnicos\n2. Dúvidas sobre Produtos\n3. Falar com um atendente');
            session[user].step = 1;
            break;
        case 1:
            if (msg === '1') {
                message.reply('Você escolheu Problemas Técnicos. Por favor, descreva o problema que está enfrentando.');
                session[user].step = 2;
            } else if (msg === '2') {
                message.reply('Você escolheu Dúvidas sobre Produtos. Qual é a sua dúvida?');
                session[user].step = 2;
            } else if (msg === '3') {
                message.reply('Um momento, estamos transferindo você para um atendente...');
                session[user].step = 0;
                // Notificar atendente humano ou registrar a solicitação.
            } else {
                message.reply('Desculpe, não entendi sua resposta. Por favor, escolha uma das opções: 1, 2 ou 3.');
            }
            break;
        case 2:
            message.reply('Obrigado por fornecer as informações. Estamos processando sua solicitação.');
            session[user].step = 0;
            // Processar a solicitação ou encaminhar para atendimento humano.
            break;
        default:
            session[user].step = 0;
            break;
    }
});

//Não seleciona a mensagem pra responder
client.on('message', async (message) => {
    if (message.body === '!consulta') {
        await client.sendMessage(message.from, 'Falha no carregamento da consulta!');
    }
});