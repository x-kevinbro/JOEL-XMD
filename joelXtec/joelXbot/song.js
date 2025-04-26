import axios from 'axios';
import config from '../../config.cjs';

const playHandler = async (m, sock) => {
  try {
    if (!m?.from || !m?.body || !sock) {
      console.error('Invalid message or socket object');
      return;
    }

    const prefix = config.PREFIX || '!';
    const body = m.body || '';

    if (!body.startsWith(prefix)) return;

    const cmd = body.slice(prefix.length).split(' ')[0].toLowerCase();
    const text = body.slice(prefix.length + cmd.length).trim();

    if (cmd === "song") {
      if (!text) {
        await sock.sendMessage(m.from, { text: "🎶 Oops! Please provide a song name or artist! 💖" }, { quoted: m });
        if (m.React) await m.React('❌');
        return;
      }

      if (m.React) await m.React('⏳');

      try {
        const apiUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data?.status || !data?.result || !data.result.download_url) {
          await sock.sendMessage(m.from, { text: "❌ Uh-oh! No results found for that song! 😔" }, { quoted: m });
          if (m.React) await m.React('❌');
          return;
        }

        const {
          title = 'Unknown',
          download_url,
          thumbnail,
          duration = '0:00',
          views = 'N/A',
          published = 'N/A',
        } = data.result;

        // 1. Send song info
        await sock.sendMessage(m.from, {
          image: { url: thumbnail },
          caption: `╭─❍「 ᴍᴜsɪᴄ ᴅᴇᴛᴀɪʟs 」❍
│  🎵 *Title:* ${title}
│  ⏱ *Duration:* ${duration}
│  👁 *Views:* ${views}
│  🗓 *Published:* ${published}
╰───────────────━⊷
ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ`,
          contextInfo: {
            externalAdReply: {
              title: title,
              body: "ᴘʟᴀʏɪɴɢ ᴠɪᴀ ᴊᴏᴇʟ xmᴅ ʙᴏᴛ",
              thumbnailUrl: thumbnail,
              sourceUrl: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
              mediaType: 1,
              renderLargerThumbnail: false,
            },
          },
        }, { quoted: m });

        // 2. Send audio
        await sock.sendMessage(m.from, {
          audio: { url: download_url },
          mimetype: "audio/mpeg",
          ptt: false,
          caption: `ᴘʟᴀʏɪɴɢ ɴᴏᴡ: *${title}*\n⏱ Duration: ${duration}\n↻ ◁ II ▷ ↺`,
          thumbnail: thumbnail,
          contextInfo: {
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363317462952356@newsletter',
              newsletterName: "ᴊᴏᴇʟ xmᴅ ʙᴏᴛ ",
              serverMessageId: -1,
            },
            externalAdReply: {
              title: "ᴊᴏᴇʟ xmᴅ ʙᴏᴛ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ",
              body: "ᴘʟᴀʏɪɴɢ ɴᴏᴡ ↻ ◁ II ▷ ↺",
              thumbnailUrl: thumbnail,
              sourceUrl: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        }, { quoted: m });

        if (m.React) await m.React('🎵');
      } catch (error) {
        console.error("Error in play command:", error);
        await sock.sendMessage(m.from, { text: "❌ Oh no! Something went wrong! 😢" }, { quoted: m });
        if (m.React) await m.React('❌');
      }
    }
  } catch (error) {
    console.error('Critical error in playHandler:', error);
    await sock.sendMessage(m.from, { text: "❌ Uh-oh! An unexpected error occurred! 😣 try song2 " }, { quoted: m });
    if (m.React) await m.React('❌');
  }
};

export default playHandler;
