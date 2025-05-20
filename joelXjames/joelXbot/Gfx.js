import config from '../../config.cjs';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

const API_KEY = '33241c3a8402295fdc';

const effectsMap = {
  wanted: 'wanted',
  ad: 'ad',
  beautiful: 'beautiful',
  blur: 'blur',
  rip: 'rip',
  jail: 'jail',
  crown: 'clown', // Note: crown maps to clown
};

const uploadMedia = async (buffer) => {
  try {
    const { ext } = await fileTypeFromBuffer(buffer);
    const bodyForm = new FormData();
    bodyForm.append("fileToUpload", buffer, `file.${ext}`);
    bodyForm.append("reqtype", "fileupload");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: bodyForm,
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
        text: '⚠️ Failed to process the image. Try again.',
      }, { quoted: m });
    }
  } else {
    if (!args.length && (!m.mentionedJid || m.mentionedJid.length === 0) && !m.quoted) {
      return Matrix.sendMessage(m.from, {
        text: `*Usage:*\n${prefix}${cmd} 255781144539 or tag/reply someone or reply an image`,
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

  const caption = `*${cmd.toUpperCase()}!*\n${isMedia ? '' : `Target: @${target.split("@")[0]}`}\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊᴏᴇʟ xᴍᴅ*`;

  const mess = {
    image: { url: finalUrl },
    caption,
    mentions: isMedia ? [] : [target],
    contextInfo: {
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363317462952356@newsletter',
        newsletterName: "ᴊᴏᴇʟ xᴅ ʙᴏᴛ",
        serverMessageId: -1
      }
    }
  };

  const timeout = setTimeout(() => {
    Matrix.sendMessage(m.from, {
      text: '⚠️ Please provide a valid WhatsApp number or reply to an image.',
    }, { quoted: m });
  }, 8000);

  try {
    await Matrix.sendMessage(m.from, mess, { quoted: m });
    clearTimeout(timeout);
  } catch (err) {
    clearTimeout(timeout);
    Matrix.sendMessage(m.from, {
      text: '⚠️ Failed to send the image.',
    }, { quoted: m });
  }
};

export default imageEffectsCommand;
