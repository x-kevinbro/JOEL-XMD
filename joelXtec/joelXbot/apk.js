import axios from 'axios';
import config from '../../config.cjs';

const apk = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (!text) {
      return m.reply(`
╭━━━「 ᴀᴘᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 」━━━
│
│ ✏️ *Enter the app name!*
│ 
│ 💡 _Example:_ ${prefix}apk Instagram
│
╰─────────────────────
ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ
      `);
    }

    m.reply('⏳ *Searching for your app, please wait...*');

    const api = `https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(text)}`;
    const { data } = await axios.get(api);

    if (!data || !data.download_link) {
      return m.reply(`
╭━━━「 ᴇʀʀᴏʀ 」━━━
│
│ ❌ *App not found!*
│ 🔍 _Please try another name._
│
╰─────────────────────
      `);
    }

    await gss.sendMessage(m.chat, {
      document: { url: data.download_link },
      fileName: `${data.apk_name}.apk`,
      mimetype: 'application/vnd.android.package-archive',
      caption: `
╭━━━「 ᴀᴘᴋ ʀᴇsᴜʟᴛ 」━━━
│
│ 📦 *Name:* ${data.apk_name}
│ 
│ 🔗 *Download:* [Here](${data.download_link})
│
╰─────────────────────
ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ
      `.trim(),
      jpegThumbnail: await (await axios.get(data.thumbnail, { responseType: 'arraybuffer' })).data,
    }, { quoted: m });

  } catch (error) {
    console.error('APK Command Error:', error);
    m.reply(`
╭━━━「 ᴇʀʀᴏʀ 」━━━
│
│ ❌ *Something went wrong!*
│ 💬 _Please try again later._
│
╰─────────────────────
    `);
  }
};

export default apk;
