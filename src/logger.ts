// src/logger.ts
import pino from 'pino';
const clc = require('cli-color');

// Configuração do logger
export const logger = pino({
    level: 'info', // Ajuste o nível de log conforme necessário
});

// Estilos coloridos
export const redBold = clc.red.bold;
export const white = clc.white;
export const whiteBold = clc.white.bold;
export const greenBold = clc.green.bold;
export const yellowBold = clc.yellow.bold;
export const yellowBoldUnderline = clc.yellow.bold.underline;
export const cyanBoldUnderline = clc.cyan.bold.underline;