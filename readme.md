# WhatsApp Bot com Baileys

Este projeto é um bot para WhatsApp utilizando a biblioteca [Baileys](https://github.com/whiskeysockets/baileys) para interações com a API do WhatsApp Web. O bot é capaz de se conectar ao WhatsApp, exibir um QR Code para autenticação, e processar mensagens recebidas.

## Índice

- [Descrição](#descrição)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Execução](#execução)
- [Uso](#uso)

## Descrição

Este projeto inclui os seguintes módulos principais:

- **connection.ts**: Gerencia a conexão com o WhatsApp, incluindo a geração e tratamento do QR Code.
- **logger.ts**: Configura o logger e estilos de mensagem coloridos para o terminal.
- **messages.ts**: Processa e exibe mensagens recebidas.
- **server.ts**: Script principal para iniciar o bot.
- **utils.ts**: Funções auxiliares, como a exibição do QR Code.

## Pré-requisitos

Antes de começar, você precisará ter o [Node.js](https://nodejs.org/) instalado em seu sistema. Recomenda-se a versão LTS.

## Instalação

1. **Clone o repositório:**

    ```sh
    git clone https://github.com/shdwmere/bot-whatsapp-baileys.git
    ```

    ```sh
    cd bot-whatsapp-baileys/
    ```

2. **Instale as dependências:**

    ```sh
    npm install
    ```

3. **Compile o código TypeScript para JavaScript:**

    ```sh
    npm run build
    ```

    Ou, se você preferir, pode usar o comando `tsc` diretamente:

    ```sh
    npx tsc
    ```

    Isso criará uma pasta `dist/` com os arquivos compilados.

## Execução

1. **Execute o código principal do servidor:**

    ```sh
    node dist/server.js
    ```

    O bot começará a rodar e exibirá um QR Code no terminal. Escaneie este QR Code com o WhatsApp para autenticar o bot.

## Uso

- **Exibição do QR Code:** Quando o bot estiver pronto para autenticação, ele exibirá um QR Code no terminal. Use o WhatsApp para escaneá-lo e conectar o bot à sua conta.
- **Processamento de Mensagens:** O bot irá processar e exibir mensagens recebidas no terminal. Mensagens de grupos e mensagens privadas são tratadas de maneira diferenciada.

## Em breve:

- **Resposta Automatica a Mensagens Privadas**
- **Extração de Participantes de um Grupo**
- **Bulk-Sending de Mensagens Privadas**
- **Suporte ao envio de Mensagens dos seguintes tipos:**
    - Texto
    - Texto com Link Preview
    - Áudios 
    - Imagens 
    - Vídeos 
    - Documentos