// src/connection.ts
import { makeWASocket, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { atualizarEstadoDaConexao } from './utils';
import { logger, redBold, greenBold, yellowBold } from './logger';

export async function connectToWhatsApp(saveCreds: any, state: any) {
    const sock = makeWASocket({
        auth: state,
        logger: logger,
        printQRInTerminal: false // QR será tratado manualmente
    });

    // Gerencia o evento de atualização da conexão
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            atualizarEstadoDaConexao('QR Code disponível', qr);
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(redBold('\n-------------------'));
            console.log(redBold('[-] Conexão fechada, tentando reconectar...'));
            console.log(redBold('-------------------\n'));
            if (shouldReconnect) {
                connectToWhatsApp(saveCreds, state);
            }
        } else if (connection === 'open') {
            console.log(greenBold('\n-------------------'));
            console.log(greenBold('[+] Conexão aberta.'));
            console.log(greenBold('-------------------\n'));
        } else if (connection === 'connecting') {
            console.log(yellowBold('\n-------------------'));
            console.log(yellowBold('[!] Conectando...'));
            console.log(yellowBold('-------------------\n'));
        }
    });

    // Salvar as credenciais sempre que forem atualizadas
    sock.ev.on('creds.update', saveCreds);

    return sock;
}
