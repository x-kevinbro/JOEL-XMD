import fs from 'fs';
import path from 'path';
import config from '../../config.cjs';

const animepicsCmd = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  const fileMap = {
    husbu: '../../joel-xmd-medias/joel-xmd-anime-pics/husbu.json',
    loli: '../../joel-xmd-medias/joel-xmd-anime-pics/loli.json',
    neko2: '../../joel-xmd-medias/joel-xmd-anime-pics/neko.json',
    shota: '../../joel-xmd-medias/joel-xmd-anime-pics/shota.json',
    waifu2: '../../joel-xmd-medias/joel-xmd-anime-pics/wifu.json',
  };

  if (!fileMap[cmd]) return;

  const filePath = path.resolve(fileMap[cmd]);
  let imageList;

  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(rawData);

    imageList = parsedData
      .filter(item => item && typeof item.url === 'string')
      .map(item => item.url);

    if (!imageList.length) throw new Error(`Empty or invalid JSON for ${cmd}`);
  } catch (error) {
    console.error(`Failed to load ${cmd} images:`, error);
    await sock.sendMessage(m.from, { text: `⚠️ Failed to load ${cmd} images!` }, { quoted: m });
    return;
  }

  const selectedImage = imageList[Math.floor(Math.random() * imageList.length)];
  const caption = 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ';

  const messagePayload = {
    image: { url: selectedImage },
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

export default animepicsCmd;
