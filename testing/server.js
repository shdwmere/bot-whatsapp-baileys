"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pino_1 = require("pino");
var baileys_1 = require("@whiskeysockets/baileys");
var clc = require('cli-color');
// Configuração do logger
var logger = (0, pino_1.default)({
    level: 'info', // Ajuste o nível de log conforme necessário
});
var redBold = clc.red.bold;
var white = clc.white;
var whiteBold = clc.white.bold;
var greenBold = clc.green.bold;
var yellowBold = clc.yellow.bold;
var yellowBoldUnderline = clc.yellow.bold.underline;
var cyanBoldUnderline = clc.cyan.bold.underline;
function atualizarEstadoDaConexao(status, qrCode) {
    console.clear();
    console.log(whiteBold("\n[\uD83D\uDCE1 Estado da Conex\u00E3o]: ".concat(status)));
    if (qrCode) {
        console.log(yellowBold('\n[🔑 Escaneie este QR Code para logar:]'));
        console.log(qrCode);
    }
}
function connectToWhatsApp() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, state, saveCreds, sock;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, baileys_1.useMultiFileAuthState)('auth_info_baileys')];
                case 1:
                    _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1.default)({
                        auth: state,
                        logger: logger,
                        printQRInTerminal: false // QR será tratado manualmente
                    });
                    sock.ev.on('connection.update', function (update) {
                        var _a, _b;
                        var connection = update.connection, lastDisconnect = update.lastDisconnect, qr = update.qr;
                        if (qr) {
                            atualizarEstadoDaConexao('QR Code disponível', qr);
                        }
                        if (connection === 'close') {
                            var shouldReconnect = ((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut;
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
                    sock.ev.on('messages.upsert', function (m) { return __awaiter(_this, void 0, void 0, function () {
                        var _i, _a, message, remoteJid, nomeDoUser, mensagemRecebida, groupId;
                        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
                        return __generator(this, function (_u) {
                            for (_i = 0, _a = m.messages; _i < _a.length; _i++) {
                                message = _a[_i];
                                remoteJid = message.key.remoteJid;
                                nomeDoUser = message.pushName;
                                mensagemRecebida = "[Mensagem não suportada]";
                                // Verificar se é uma mensagem de grupo
                                if (remoteJid.endsWith('@g.us')) {
                                    groupId = remoteJid.split('@')[0];
                                    // Verifica o tipo de mensagem e tenta extrair o texto, se houver
                                    if ((_b = message.message) === null || _b === void 0 ? void 0 : _b.conversation) {
                                        mensagemRecebida = message.message.conversation;
                                    }
                                    else if ((_d = (_c = message.message) === null || _c === void 0 ? void 0 : _c.extendedTextMessage) === null || _d === void 0 ? void 0 : _d.text) {
                                        mensagemRecebida = message.message.extendedTextMessage.text;
                                    }
                                    else if ((_f = (_e = message.message) === null || _e === void 0 ? void 0 : _e.imageMessage) === null || _f === void 0 ? void 0 : _f.caption) {
                                        mensagemRecebida = message.message.imageMessage.caption;
                                    }
                                    else if ((_h = (_g = message.message) === null || _g === void 0 ? void 0 : _g.videoMessage) === null || _h === void 0 ? void 0 : _h.caption) {
                                        mensagemRecebida = message.message.videoMessage.caption;
                                    }
                                    else if ((_k = (_j = message.message) === null || _j === void 0 ? void 0 : _j.documentMessage) === null || _k === void 0 ? void 0 : _k.caption) {
                                        mensagemRecebida = message.message.documentMessage.caption;
                                    }
                                    console.log(whiteBold('\n-------------------'));
                                    console.log(whiteBold("\n[+] Nova mensagem | Group ID: ".concat(cyanBoldUnderline(groupId), "\n")));
                                    console.log(whiteBold("".concat(yellowBoldUnderline(nomeDoUser), ": ").concat(white(mensagemRecebida), "\n")));
                                    console.log(whiteBold('-------------------\n'));
                                }
                                else {
                                    // Mensagem privada
                                    if ((_l = message.message) === null || _l === void 0 ? void 0 : _l.conversation) {
                                        mensagemRecebida = message.message.conversation;
                                    }
                                    else if ((_o = (_m = message.message) === null || _m === void 0 ? void 0 : _m.extendedTextMessage) === null || _o === void 0 ? void 0 : _o.text) {
                                        mensagemRecebida = message.message.extendedTextMessage.text;
                                    }
                                    else if ((_p = message.message) === null || _p === void 0 ? void 0 : _p.imageMessage) {
                                        mensagemRecebida = "[Imagem recebida]";
                                    }
                                    else if ((_q = message.message) === null || _q === void 0 ? void 0 : _q.videoMessage) {
                                        mensagemRecebida = "[Vídeo recebido]";
                                    }
                                    else if ((_r = message.message) === null || _r === void 0 ? void 0 : _r.documentMessage) {
                                        mensagemRecebida = "[Documento recebido: ".concat(message.message.documentMessage.fileName, "]");
                                    }
                                    else if ((_s = message.message) === null || _s === void 0 ? void 0 : _s.audioMessage) {
                                        mensagemRecebida = "[Áudio recebido]";
                                    }
                                    else if ((_t = message.message) === null || _t === void 0 ? void 0 : _t.stickerMessage) {
                                        mensagemRecebida = "[Sticker recebido]";
                                    }
                                    console.log(whiteBold('\n-------------------'));
                                    console.log(whiteBold("\n[+] Nova mensagem | ".concat(cyanBoldUnderline('PV'), "\n")));
                                    console.log("".concat(yellowBoldUnderline(nomeDoUser), ": ").concat(mensagemRecebida, "\n"));
                                    console.log(whiteBold('-------------------\n'));
                                }
                                if (message.key.fromMe) {
                                    console.log(yellowBold('\n-------------------'));
                                    console.log(yellowBold('[!] Ignorando mensagem enviada pelo próprio bot.'));
                                    console.log(yellowBold('-------------------\n'));
                                    continue;
                                }
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
connectToWhatsApp();
