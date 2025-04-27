import fetch from 'node-fetch';
import config from '../../config.cjs';

const apkDownloader = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd !== 'apk') return; // Only trigger on 'apk' command

  try {
    if (!text) {
      return m.reply('❌ *Please provide the name of the APK you want to search.*\n\nExample:\n' + `${prefix}apk whatsapp`);
    }

    await Matrix.sendMessage(m.from, { react: { text: '⏳', key: m.key } });

    const fetchJson = async (url) => {
      const res = await fetch(url);
      return await res.json();
    };

    const apiUrl = `https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(text)}`;
    const data = await fetchJson(apiUrl);

    if (!data || !data.status || !data.result) {
      return m.reply('⚠️ *Failed to fetch APK information. Please try a different app name.*');
    }

    const { title, thumbnail, download_link } = data.result;
    const safeTitle = title.replace(/[<>:"/\\|?*]+/g, '_'); // Clean filename

    const caption = `╭─❍「 *APK Downloader* 」❍\n`
      + `│ 📦 *Name:* ${title}\n`
      + `│ 🔗 *Status:* Successfully Found\n`
      + `╰───────────────━⊷\n\n`
      + `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ`;

    await Matrix.sendMessage(m.from, { react: { text: '⬆️', key: m.key } });

    await Matrix.sendMessage(m.from, {
      image: { url: thumbnail },
      caption: caption
    }, { quoted: m });

    await Matrix.sendMessage(m.from, {
      document: { url: download_link },
      fileName: `${safeTitle}.apk`,
      mimetype: 'application/vnd.android.package-archive',
      caption: '📥 *Here is your APK!*'
    }, { quoted: m });

    await Matrix.sendMessage(m.from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error('Error fetching APK:', error);
    m.reply('*An unexpected error occurred while processing your APK request. Please try again later.*');
  }
};
// codes by lord joel 
export default apkDownloader;
