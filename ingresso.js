const { Client, Axios, Qrcode, LocalAuth, MessageMedia } = require('./index');
const http = require('http');
const fs = require('fs');

const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

console.log('Iniciou');

const client = new Client({
    authStrategy: new LocalAuth(),
});

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

client.on('message', async (message) => {

    // async function teste_img() {

    //     const chatId = "5532988276661@c.us";

    //     const filePath = 'ingressos/ingresso.png';

    //     let url = "http://cinema.veredastecnologia/assets/ingressos/ingresso.png";
    //     const media = await MessageMedia.fromUrl(url);
    //     media.mimetype = "image/png";
    //     media.filename = "CustomImageName.png";
    //     await client.sendMessage(chatId, media, { caption: "Image" });

    //     console.log('caiu envia_imagem 1');

    // }

});

async function sendImage(nome_arquivo) {
    //const chatId = "553299849285@c.us"; //Lary
    const chatId = "553288276661@c.us"; //Fábio

    const imagePath = 'uploads/' + nome_arquivo; // Caminho para a imagem dentro da pasta 'uploads'

    // Verifica se o arquivo existe
    if (!fs.existsSync(imagePath)) {
        console.log('A imagem não existe.');
        return;
    }

    console.log('nome:' + nome_arquivo);

    // Envia a imagem
    const media = await MessageMedia.fromFilePath(imagePath);
    await client.sendMessage(chatId, media, { caption: "image" }).then(() => {
        console.log('Imagem enviada com sucesso.');
    }).catch((error) => {
        console.error('Erro ao enviar a imagem:', error);
    });
}

// Configuração do multer para armazenar arquivos com a extensão .png
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        var nome_arquivo = file.fieldname + '-' + Date.now() + '.png';
        cb(null, nome_arquivo);
    }
});

const upload = multer({ storage: storage });

// Rota para receber uma requisição GET
app.get('/', (req, res) => {
    res.send('Olá, mundo!');
});

// Rota para receber uma requisição POST com envio de arquivo
app.post('/enviar', upload.single('ingresso'), (req, res) => {
    // Acessar o arquivo enviado
    const arquivo = req.file;
    console.log('Arquivo recebido:', arquivo);
    res.send('Arquivo recebido com sucesso!');
    sendImage(arquivo.filename);
});

// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

