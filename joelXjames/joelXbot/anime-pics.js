import fs from 'fs';
import path from 'path';
import config from '../../config.cjs';

const husbuCmd = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmd !== 'husbu') return;

  // Updated JSON file path
  const filePath = path.resolve('./joel-xmd-medias/joel-xmd-anime-pics/husbu.json');
  let husbuList;

  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(rawData);

    // Extract valid URLs
    husbuList = parsedData
      .filter(item => item && typeof item.url === 'string')
      .map(item => item.url);

    if (!husbuList.length) throw new Error('Empty or invalid husbu list');
  } catch (error) {
    console.error('Failed to load husbu images:', error);
    await sock.sendMessage(m.from, { text: "⚠️ Failed to load husbu images!" }, { quoted: m });
    return;
  }

  // Pick a random image
  const husbuImage = husbuList[Math.floor(Math.random() * husbuList.length)];
  const caption = 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ';

  const messagePayload = {
    image: { url: husbuImage },
    caption: caption,
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
        renderLargerThumbnail: false,
      },
    },
  };

  await sock.sendMessage(m.from, messagePayload, { quoted: m });
};

export default husbuCmd;
