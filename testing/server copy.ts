// server.ts
import pino from 'pino';
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
const clc = require('cli-color');


// Configuração do logger
const logger = pino({
    level: 'info', // Ajuste o nível de log conforme necessário
});

const redBold = clc.red.bold;
const white = clc.white;
const whiteBold = clc.white.bold;
const greenBold = clc.green.bold;
const yellowBold = clc.yellow.bold;
const yellowBoldUnderline = clc.yellow.bold.underline;
const cyanBoldUnderline = clc.cyan.bold.underline;

function atualizarEstadoDaConexao(status: string, qrCode?: string) {
    console.clear();
    console.log(whiteBold(`\n[📡 Estado da Conexão]: ${status}`));

    if(qrCode) {
        console.log(yellowBold('\n[🔑 Escaneie este QR Code para logar:]'));
        console.log(qrCode);
    }
}


async function connectToWhatsApp() {

    // utility function to help save the auth state in a single folder
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        auth: state,
        logger: logger,
        printQRInTerminal: false // QR será tratado manualmente
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            atualizarEstadoDaConexao('QR Code disponível', qr);
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(redBold('\n-------------------'));
            console.log(redBold('[-] Conexão fechada, tentando reconectar...\n'));
            console.log(redBold('-------------------\n'));
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } 
        else if (connection === 'open') {
            console.log(greenBold('\n-------------------'));
            console.log(greenBold('[+] Conexão aberta.'));
            console.log(greenBold('-------------------\n'));
        }
        else if (connection === 'connecting') {
            console.log(yellowBold('\n-------------------'));
            console.log(yellowBold('[!] Conectando...'));
            console.log(yellowBold('-------------------\n'));
        }
    });


    // Salvar as credenciais sempre que forem atualizadas
    sock.ev.on('creds.update', saveCreds);


    // Gerencia recebimento de mensagens
    sock.ev.on('messages.upsert', async (m) => {
        for (const message of m.messages) {
            const remoteJid = message.key.remoteJid!;
            const nomeDoUser = message.pushName;
            let mensagemRecebida = "[Mensagem não suportada]";
    
            // Verificar se é uma mensagem de grupo
            if (remoteJid.endsWith('@g.us')) {
                const groupId = remoteJid.split('@')[0];
    
                // Verifica o tipo de mensagem e tenta extrair o texto, se houver
                if (message.message?.conversation) {
                    mensagemRecebida = message.message.conversation;
                } else if (message.message?.extendedTextMessage?.text) {
                    mensagemRecebida = message.message.extendedTextMessage.text;
                } else if (message.message?.imageMessage?.caption) {
                    mensagemRecebida = message.message.imageMessage.caption;
                } else if (message.message?.videoMessage?.caption) {
                    mensagemRecebida = message.message.videoMessage.caption;
                } else if (message.message?.documentMessage?.caption) {
                    mensagemRecebida = message.message.documentMessage.caption;
                }
    
                console.log(whiteBold('\n-------------------'));
                console.log(whiteBold(`\n[+] Nova mensagem | Group ID: ${cyanBoldUnderline(groupId)}\n`));
                console.log(whiteBold(`${yellowBoldUnderline(nomeDoUser)}: ${white(mensagemRecebida)}\n`));
                console.log(whiteBold('-------------------\n'));
            } else {
                // Mensagem privada
                if (message.message?.conversation) {
                    mensagemRecebida = message.message.conversation;
                } else if (message.message?.extendedTextMessage?.text) {
                    mensagemRecebida = message.message.extendedTextMessage.text;
                } else if (message.message?.imageMessage) {
                    mensagemRecebida = "[Imagem recebida]";
                } else if (message.message?.videoMessage) {
                    mensagemRecebida = "[Vídeo recebido]";
                } else if (message.message?.documentMessage) {
                    mensagemRecebida = `[Documento recebido: ${message.message.documentMessage.fileName}]`;
                } else if (message.message?.audioMessage) {
                    mensagemRecebida = "[Áudio recebido]";
                } else if (message.message?.stickerMessage) {
                    mensagemRecebida = "[Sticker recebido]";
                }
    
                console.log(whiteBold('\n-------------------'));
                console.log(whiteBold(`\n[+] Nova mensagem | ${cyanBoldUnderline('PV')}\n`));
                console.log(`${yellowBoldUnderline(nomeDoUser)}: ${mensagemRecebida}\n`);
                console.log(whiteBold('-------------------\n'));
            }
    
            if (message.key.fromMe) {
                console.log(yellowBold('\n-------------------'));
                console.log(yellowBold('[!] Ignorando mensagem enviada pelo próprio bot.'));
                console.log(yellowBold('-------------------\n'));
                continue;
            }
        }
    });
    
    
}

connectToWhatsApp();