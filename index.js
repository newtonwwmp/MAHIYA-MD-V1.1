require("dotenv").config();
const { Client, LocalAuth } = require("whatsapp-web.js");
const autoStatus = require("./plugins/autoStatus");
const commandHandler = require("./command");

const sessionId = process.env.SESSION_ID || "default"; // Default session if not set

const client = new Client({
    authStrategy: new LocalAuth({ 
        dataPath: `./auth_info_baileys_${sessionId}` 
    }),
    puppeteer: { headless: true }
});

client.on("ready", async () => {
    console.log("✅ Bot is ready!");

    // Auto Status Features
    autoStatus(client);

    // Check session info
    console.log(`🟢 Running session: ${sessionId}`);
});

client.on("message", (msg) => {
    commandHandler(client, msg);
});

client.initialize();
