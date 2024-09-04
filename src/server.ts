// src/server.ts
import { useMultiFileAuthState } from '@whiskeysockets/baileys';
import { connectToWhatsApp } from './connection';
import { handleMessage } from './messages';

async function main() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = await connectToWhatsApp(saveCreds, state);

    handleMessage(sock);
}

main();
