const fs = require("fs-extra");
const config = require("../config");

module.exports = (client) => {
    // Auto Status Seen
    client.getChats().then((chats) => {
        chats.forEach(async (chat) => {
            if (chat.isStatus) {
                await chat.sendSeen();
                console.log("✅ Seen status:", chat.id._serialized);
            }
        });
    });

    // Auto Like Status (Reaction)
    client.on("message_create", async (msg) => {
        if (msg.from.endsWith("@status") && msg.hasMedia) {
            await msg.react(config.emojiReaction);
            console.log("❤️ Reacted to status:", msg.id.id);
        }
    });

    // Auto Save Status
    client.on("message", async (msg) => {
        if (msg.from.endsWith("@status") && msg.hasMedia) {
            const media = await msg.downloadMedia();
            const fileName = `${config.statusSavePath}${Date.now()}.${media.mimetype.split("/")[1]}`;
            
            fs.ensureDirSync(config.statusSavePath);
            fs.writeFileSync(fileName, media.data, "base64");
            
            console.log("📥 Saved status:", fileName);
        }
    });
};
