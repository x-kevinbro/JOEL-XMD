import config from '../../config.cjs';

const getTimeWish = (name) => {
  const date = new Date().toLocaleString("en-US", { timeZone: "Africa/Dar_es_Salaam" });
  const hour = new Date(date).getHours();

  if (hour >= 5 && hour < 12) return `Good morning, ${name}`;
  if (hour >= 12 && hour < 17) return `Good afternoon, ${name}`;
  if (hour >= 17 && hour < 20) return `Good evening, ${name}`;
  return `Good night, ${name}`;
};

const formatUptime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs}h ${mins}m ${secs}s`;
};

const LogoCmd = async (m, sock) => {
  const prefix = config.PREFIX;
  const pushName = m.pushName || 'User';
  const uptime = formatUptime(process.uptime());

  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  const sendCommandMessage = async (messageContent) => {
    const messagePayload = {
      text: messageContent,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363317462952356@newsletter',
          newsletterName: "ᴊᴏᴇʟ xᴅ ʙᴏᴛ",
          serverMessageId: -1,
        },
        externalAdReply: {
          title: "ᴊᴏᴇʟ xᴅ ʙᴏᴛ",
          body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ",
          thumbnailUrl:
            'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/joelXbot.jpg',
          sourceUrl: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    };

    await sock.sendMessage(m.from, messagePayload, { quoted: m });
  };

  if (cmd === "menu2") {
    try {
      await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

      const logoUrl = 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/joelXbot.jpg';
      const timeWish = getTimeWish(pushName);

      const caption1 = `
╭───────────────━⊷
║ ᴊᴏᴇʟ-xᴍᴅ ᴍᴀɪɴ ᴍᴇɴᴜ
╰───────────────━⊷
╭───────────────━⊷
║🤖 *ɴᴀᴍᴇ:* ᴊᴏᴇʟ-xᴍᴅ
║🌚 *ᴘʀᴇғɪx:*  ${config.PREFIX}
║💫 *ᴛʜᴇᴍᴇ:*  ʝσєℓ 
║🤖 *ᴍᴏᴅᴇ:*  ${config.MODE}
║❗ *sᴛᴀᴛᴜs:*  ᴏɴʟɪɴᴇ
║⏱️ *ᴜᴘᴛɪᴍᴇ:* ${uptime}
║👤 *ᴏᴡɴᴇʀ:* ʟᴏʀᴅ ᴊᴏᴇʟ
╰───────────────━⊷
*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ*`;

      const caption2 = `
${timeWish}, here is Joel Xmd menu
⏱️ Bot Uptime: ${uptime}
`;

      const caption3 = `
${timeWish}, I'm Joel Xmd
⏱️ Bot Uptime: ${uptime}
`;

      const captions = [caption1, caption2, caption3];
      const caption = captions[Math.floor(Math.random() * captions.length)];

      const messagePayload = {
        image: { url: logoUrl },
        caption: caption,
        contextInfo: {
          isForwarded: false,
          forwardingScore: 999,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363317462952356@newsletter',
            newsletterName: "",
            serverMessageId: -1,
          },
          externalAdReply: {
            title: "ᴊᴏᴇʟ xᴅ ʙᴏᴛ",
            body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ",
            thumbnailUrl:
              'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/joelXtec.jpg',
            sourceUrl: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
            mediaType: 1,
            renderLargerThumbnail: false,
          },
        },
      };

      await sock.sendMessage(m.from, messagePayload, { quoted: m });
      await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });

    } catch (error) {
      console.error(error);
      await sendCommandMessage("⚠️ An error occurred while sending the menu. Please try again later!");
    }
  }
};

export default LogoCmd;
