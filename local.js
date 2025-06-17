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

// Data Atual
const data_atual = new Date().toLocaleString();
const dia_atual = new Date().getDay(); //4 = Quinta / 5 = Sexta

// Your message.
const text = "Hey Lary";

// Pegando o chatId para enviar mensagem.
//const chatId = "120363236388884615@g.us"; // Grupo sim
const chatId = "553288084030-1481737901@g.us"; // Grupo VTI

// Sending message.
//client.sendMessage(chatId, text);

//Seleciona a mensagem pra responder
client.on('message', async (message) => {

  // Sending message.
  //client.sendMessage(chatId, text);

  let isProcessing = false; // Controle de execução
  const alreadySent = {}; // Controle de mensagens enviadas

  //async function enviarMensagemEscala() {
  const diaAtual = new Date().getDate(); // Dia atual
  const horaAtual = new Date().toLocaleTimeString();

  if (isProcessing) {
    console.log('Já está processando, ignorando nova execução...');
    return; // Impede múltiplas execuções
  }

  if (
    parseInt(dia_atual) === 5 &&
    horaAtual >= '17:00:00' &&
    !alreadySent[diaAtual]
  ) {
    isProcessing = true; // Ativa o bloqueio

    try {
      console.log('Enviando mensagem...');
      //const response = await Axios.get('http://meufinanceiro/API/get_escala');
      const response = await Axios.get('https://helpdesk.veredastecnologia.com.br/API/get_escala');

      if (response.data.error !== true) {
        await client.sendMessage(chatId, response.data.data);

        // Registra que a mensagem foi enviada
        alreadySent[diaAtual] = true;

        console.log('Mensagem enviada com sucesso!');
        await sleep(20000); // Delay antes de liberar
      }
    } catch (error) {
      console.error('Erro na requisição:', error.message);
    } finally {
      isProcessing = false; // Libera o bloqueio
      console.log('Processamento concluído.');
    }
  }
  //}

  // Limpa o registro no dia seguinte
  setInterval(() => {
    const hoje = new Date().getDate();
    for (const dia in alreadySent) {
      if (parseInt(dia) !== hoje) {
        delete alreadySent[dia];
      }
    }
  }, 86400000); // Executa a cada 24 horas

  // INÍCIO TRECHO QUE ENVIA MENSAGEM DA ESCALA (SEM VALIDAÇÃO DE ENVIO DUPLICADO)

  // if (parseInt(dia_atual) == parseInt(5) && new Date().toLocaleTimeString() >= '17:00:00') {
  //   try {
  //     //const response = await Axios.get('http://newfinanceiro.mdbgo.io/API/get_escala');
  //     const response = await Axios.get('http://meufinanceiro/API/get_escala');
  //     //await client.sendMessage(message.from, response.data.data);

  //     if (response.data.error != true) {
  //       console.log('caiu');
  //       await client.sendMessage(chatId, response.data.data);
  //       await sleep(20000);
  //     }

  //     //console.log('Resposta:', response.data.data);
  //   } catch (error) {
  //     //await client.sendMessage(message.from, 'Ocorreu um erro ao tentar realizar sua solicitação!');
  //     console.error('Erro na requisição:', error.message);
  //   }
  // }

  // FIM TRECHO QUE ENVIA MENSAGEM DA ESCALA (SEM VALIDAÇÃO DE ENVIO DUPLICADO)

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

function sleep(ms) {
  console.log('sleep');
  return new Promise(resolve => setTimeout(resolve, ms));
}