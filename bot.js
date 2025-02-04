const { default: makeWASocket, useMultiFileAuthState, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

// CLI Arguments Handling
const args = process.argv.slice(2);
const COMMANDS = {
    START: '--start',
    RESET_AUTH: '--reset-auth'
};

(async () => {
    if (args.includes(COMMANDS.RESET_AUTH)) {
        console.log('Resetting authentication...');
        fs.rmSync('auth', { recursive: true, force: true });
        console.log('Authentication reset. Restart the bot and scan the QR code again.');
        process.exit(0);
    }

    console.log('Starting WhatsApp Bot...');
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const sock = makeWASocket({ auth: state });

    sock.ev.on('creds.update', saveCreds);

    // Automatically view all status updates
    sock.ev.on('messages.upsert', async ({ messages }) => {
        for (const msg of messages) {
            if (msg.key.remoteJid === 'status@broadcast') {
                console.log(`Viewing status from ${msg.pushName}`);
                await sock.readMessages([msg.key]);
            }
        }
    });

    // Listen for commands in private chat
    sock.ev.on('messages.upsert', async ({ messages }) => {
        for (const msg of messages) {
            if (!msg.message || msg.key.fromMe) continue;
            const sender = msg.key.remoteJid;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

            if (['!save', '.save', '.send', '.ewanna'].includes(text)) {
                console.log(`Executing command: ${text}`);
                await saveLatestStatus(sock, sender, text);
            }
        }
    });
})();

// Function to save the latest status
async function saveLatestStatus(sock, sender, command) {
    try {
        const chats = await sock.chatModify({ add: 'status@broadcast' }, sender);
        if (!chats || chats.length === 0) {
            return sock.sendMessage(sender, { text: 'No statuses found!' });
        }
        
        for (const chat of chats) {
            if (chat.message) {
                const messageType = Object.keys(chat.message)[0];
                if (messageType === 'imageMessage' || messageType === 'videoMessage') {
                    const media = chat.message[messageType];
                    const stream = await downloadContentFromMessage(media, messageType.replace('Message', ''));
                    
                    const fileName = path.join(__dirname, 'statuses', `${Date.now()}.${messageType === 'imageMessage' ? 'jpg' : 'mp4'}`);
                    if (!fs.existsSync('statuses')) fs.mkdirSync('statuses');
                    
                    const fileStream = fs.createWriteStream(fileName);
                    for await (const chunk of stream) fileStream.write(chunk);
                    fileStream.end();
                    
                    sock.sendMessage(sender, { text: `Status saved successfully with command: ${command}!` });
                    return;
                }
            }
        }
        
        sock.sendMessage(sender, { text: 'No media status found!' });
    } catch (error) {
        console.error('Error saving status:', error);
        sock.sendMessage(sender, { text: 'Error saving status!' });
    }
}
