require("dotenv").config();

module.exports = (client, msg) => {
    if (msg.body === "!menu") {
        const menuMessage = `
╭────✧ 𝗠𝗔𝗛𝗜𝗬𝗔__𝗠𝗗 ✧────◆
│
│  🎀 *𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝑳𝒊𝒔𝒕* 🎀
│
│  ✨ *𝙈𝙚𝙣𝙪* ➜ _!menu_
│  🟢 *𝘼𝙡𝙞𝙫𝙚* ➜ _!alive_
│  📥 *𝘼𝙪𝙩𝙤 𝙎𝙩𝙖𝙩𝙪𝙨 𝙎𝙚𝙚𝙣* ✅
│  ❤️ *𝘼𝙪𝙩𝙤 𝙇𝙞𝙠𝙚 𝙎𝙩𝙖𝙩𝙪𝙨* 
│  📥 *𝘼𝙪𝙩𝙤 𝙎𝙖𝙫𝙚 𝙎𝙩𝙖𝙩𝙪𝙨* ➜ _.save_
│  📤 *𝙎𝙚𝙣𝙙 𝙎𝙖𝙫𝙚𝙙 𝙎𝙩𝙖𝙩𝙪𝙨* ➜ _.send_
│  📤 *𝙎𝙚𝙣𝙙 𝘼𝙡𝙡 𝙎𝙖𝙫𝙚𝙙 𝙎𝙩𝙖𝙩𝙪𝙨𝙚𝙨* ➜ _.ewanna_
│
╰────✧ 𝗠𝗔𝗛𝗜𝗬𝗔__𝗠𝗗 ✧────◆
`;

        msg.reply(menuMessage);
    }

    if (msg.body === "!alive") {
        const aliveMessage = process.env.ALIVE_MSG || "✨ 𝙄 𝙖𝙢 𝙖𝙡𝙞𝙫𝙚 𝙖𝙣𝙙 𝙧𝙪𝙣𝙣𝙞𝙣𝙜! 🚀";
        const aliveImage = process.env.ALIVE_IMG;

        if (aliveImage) {
            client.sendMessage(msg.from, aliveMessage, { media: { url: aliveImage } });
        } else {
            msg.reply(aliveMessage);
        }
    }
};
