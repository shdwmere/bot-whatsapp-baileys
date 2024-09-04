// src/utils.ts
import { whiteBold, yellowBold } from './logger';
const qr = require('qrcode-terminal')

export function atualizarEstadoDaConexao(status: string, qrCode?: string) {
    console.clear();
    console.log(whiteBold(`\n[📡 Estado da Conexão]: ${status}`));

    if (qrCode) {
        console.log(yellowBold('\n[🔑 Escaneie este QR Code para logar:]'));
        qr.generate(qrCode, { small: true }, (qr: string) => {
            console.log(qr);
        });
    }
}
