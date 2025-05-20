import config from '../../config.cjs';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

const API_KEY = '33241c3a8402295fdc';
const BOT_SOURCE_URL = 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K';
const THUMBNAIL_URL = 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/joelXbot.jpg';

const effectsMap = {
  wanted: 'wanted',
  ad: 'ad',
  beautiful: 'beautiful',
  blur: 'blur',
  rip: 'rip',
  jail: 'jail',
  crown: 'clown' // Note: "crown" uses "clown" effect
};

const uploadMedia = async (buffer) => {
  try {
    const { ext } = await fileTypeFromBuffer(buffer);
    const form = new FormData();
    form.append("fileToUpload", buffer, `file.${ext}`);
    form.append("reqtype", "fileupload");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: form,
    });

    if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
    return await res.text();
  } catch (err) {
    console.error("Upload error:", err);
    throw new Error('Failed to upload image.');
  }
};

const imageEffectsCommand = async (m, Matrix) => {
  const prefix = config.PREFIX;
  if (!m.body.startsWith(prefix)) return;

  const args = m.body.slice(prefix.length).trim().split(/\s+/);
  const cmd = args.shift().toLowerCase();
  if (!Object.keys(effectsMap).includes(cmd)) return;

  let imageUrl;
  let target;
  let isMedia = false;

  if (m.quoted && m.quoted.mtype === 'imageMessage') {
    try {
      const media = await m.quoted.download();
      imageUrl = await uploadMedia(media);
      target = m.sender;
      isMedia = true;
    } catch {
      return Matrix.sendMessage(m.from, {
        text: '```⚠️ Failed to process the image. Try again.```',
      }, { quoted: m });
    }
  } else {
    if (!args.length && (!m.mentionedJid || m.mentionedJid.length === 0) && !m.quoted) {
      return Matrix.sendMessage(m.from, {
        text: `\`\`\`\n*Usage:*\n${prefix}${cmd} 255781144539\nOr tag/reply someone or reply with an image\n\`\`\``,
      }, { quoted: m });
    }

    if (m.mentionedJid?.length > 0) {
      target = m.mentionedJid[0];
    } else if (args[0]?.match(/^\d{5,}$/)) {
      target = args[0].replace(/\D/g, '') + "@s.whatsapp.net";
    } else if (m.quoted) {
      target = m.quoted.sender;
    } else {
      target = m.sender;
    }

    try {
      imageUrl = await Matrix.profilePictureUrl(target, 'image');
    } catch {
      imageUrl = "https://telegra.ph/file/95680cd03e012bb08b9e6.jpg";
    }
  }

  const apiEffect = effectsMap[cmd];
  const finalUrl = `https://api.nexoracle.com/image-processing/${apiEffect}?apikey=${API_KEY}&img=${encodeURIComponent(imageUrl)}`;

  const caption = `\`\`\`\n*${cmd.toUpperCase()}!*\n${isMedia ? '' : `Target: @${target.split("@")[0]}`}\n\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊᴏᴇʟ xᴍᴅ\n${BOT_SOURCE_URL}\n\`\`\``;

  const message = {
    image: { url: finalUrl },
    caption,
    mentions: isMedia ? [] : [target],
    contextInfo: {
      isForwarded: true,
      forwardingScore: 999,
      externalAdReply: {
        showAdAttribution: true,
        title: "ᴊᴏᴇʟ ʙᴏᴛ ɪᴍᴀɢᴇ ᴇᴅɪᴛ",
        body: "Powered by JOEL XMD",
        thumbnailUrl: THUMBNAIL_URL,
        sourceUrl: BOT_SOURCE_URL,
        mediaType: 1,
        renderLargerThumbnail: true
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363317462952356@newsletter',
        newsletterName: "ᴊᴏᴇʟ xᴅ ʙᴏᴛ",
        serverMessageId: -1
      }
    }
  };

  const timeout = setTimeout(() => {
    Matrix.sendMessage(m.from, {
      text: '```⚠️ Please provide a valid WhatsApp number or reply to an image.```',
    }, { quoted: m });
  }, 8000);

  try {
    await Matrix.sendMessage(m.from, message, { quoted: m });
    clearTimeout(timeout);
  } catch (err) {
    clearTimeout(timeout);
    Matrix.sendMessage(m.from, {
      text: '```⚠️ Failed to send the image.```',
    }, { quoted: m });
  }
};

export default imageEffectsCommand;
