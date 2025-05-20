import fs from 'fs';
import path from 'path';
import config from '../../config.cjs';

const ppcoupleCmd = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmd !== 'ppcouple') return;

  const filePath = path.resolve('../../joel-xmd-medias/joel-xmd-anime-picsjoel-xmd-randompics/ppcauple.json');

  let data;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read ppcouple JSON:', err);
    await sock.sendMessage(m.from, { text: '⚠️ Failed to load couple images.' }, { quoted: m });
    return;
  }

  const random = data[Math.floor(Math.random() * data.length)];
  const caption = 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ';

  try {
    await sock.sendMessage(m.from, {
      image: { url: random.male },
      caption: `${caption}\n\n👦 Male`,
      contextInfo: {
        externalAdReply: {
          title: "ᴊᴏᴇʟ xᴅ ʙᴏᴛ",
          body: caption,
          thumbnailUrl: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/joelXbot.jpg',
          sourceUrl: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m });

    await sock.sendMessage(m.from, {
      image: { url: random.female },
      caption: `${caption}\n\n👧 Female`,
      contextInfo: {
        externalAdReply: {
          title: "ᴊᴏᴇʟ xᴅ ʙᴏᴛ",
          body: caption,
          thumbnailUrl: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/joelXbot.jpg',
          sourceUrl: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m });

  } catch (err) {
    console.error('Failed to send images:', err);
  }
};

export default ppcoupleCmd;
