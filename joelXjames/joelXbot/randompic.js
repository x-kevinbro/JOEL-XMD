import fs from 'fs';
import path from 'path';
import config from '../../config.cjs';

const randompicCmd = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  const validCmds = [
    "aesthetic", "antiwork", "bike", "blackpink", "boneka", "car", "cat",
    "cosplay", "dogo", "justina", "kayes", "kpop", "notnot",
    "ppcouple", "profile", "pubg", "rose", "ryujin",
    "wallhp", "wallml", "ulzzangboy", "ulizzanggirl"
  ];

  if (!validCmds.includes(cmd)) return;

  const filePath = path.resolve(`../../joel-xmd-medias/joel-xmd-anime-picsjoel-xmd-randompics/${cmd}.json`);

  let imageData;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    imageData = JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading ${cmd}.json:`, err);
    await sock.sendMessage(m.from, { text: `⚠️ Failed to load ${cmd} images.` }, { quoted: m });
    return;
  }

  const caption = 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ';

  if (cmd === 'ppcouple') {
    const selected = imageData[Math.floor(Math.random() * imageData.length)];
    if (!selected?.male || !selected?.female) {
      await sock.sendMessage(m.from, { text: `⚠️ Invalid ppcouple data.` }, { quoted: m });
      return;
    }

    await sock.sendMessage(m.from, {
      image: { url: selected.male },
      caption: `${caption} - Male`
    }, { quoted: m });

    await sock.sendMessage(m.from, {
      image: { url: selected.female },
      caption: `${caption} - Female`
    }, { quoted: m });

  } else {
    const images = imageData
      .filter(item => typeof item.url === 'string')
      .map(item => item.url);

    if (!images.length) {
      await sock.sendMessage(m.from, { text: `⚠️ No valid images found for ${cmd}` }, { quoted: m });
      return;
    }

    const selectedImage = images[Math.floor(Math.random() * images.length)];
    await sock.sendMessage(m.from, {
      image: { url: selectedImage },
      caption: caption,
      contextInfo: {
        externalAdReply: {
          title: "ᴊᴏᴇʟ xᴅ ʙᴏᴛ",
          body: caption,
          thumbnailUrl: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/joelXbot.jpg',
          sourceUrl: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
          mediaType: 1,
          renderLargerThumbnail: false,
        }
      }
    }, { quoted: m });
  }
};
//thanks to Dream Guy DGXeon
export default randompicCmd;
