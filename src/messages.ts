// src/messages.ts
import { cyanBoldUnderline, whiteBold, yellowBoldUnderline, yellowBold } from './logger';

export function handleMessage(sock: any) {
    sock.ev.on('messages.upsert', async (m: any) => {
        for (const message of m.messages) {
            const remoteJid = message.key.remoteJid!;
            const nomeDoUser = message.pushName || 'Usuario Desconhecido';
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
                } else if (message.message?.documentMessage?.fileName) {
                    mensagemRecebida = `[Documento recebido: ${message.message.documentMessage.fileName}]`;
                } else if (message.message?.audioMessage) {
                    mensagemRecebida = "[Áudio recebido]";
                } else if (message.message?.stickerMessage) {
                    mensagemRecebida = "[Sticker recebido]";
                }

                console.log(whiteBold('\n-------------------'));
                console.log(whiteBold(`\n[+] Nova mensagem | Group ID: ${cyanBoldUnderline(groupId)}\n`));
                console.log(whiteBold(`${yellowBoldUnderline(nomeDoUser)}: ${mensagemRecebida}\n`));
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
                console.log(whiteBold(`\n[+] Nova mensagem | PV\n`));
                console.log(`${yellowBoldUnderline(nomeDoUser)}: ${mensagemRecebida}\n`);
                console.log(whiteBold('-------------------\n'));
            }

            if (message.key.fromMe) {
                console.log(yellowBold('\n[!] Ignorando mensagem enviada pelo próprio bot.\n'));
            }
        }
    });
}
