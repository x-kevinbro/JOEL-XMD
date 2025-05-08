import axios from "axios";
import config from '../../config.cjs';

const xnxHandler = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  if (cmd !== "xnx") return;

  const senderNumber = m.sender.replace(/\D/g, '');

  try {
    const res = await axios.get("https://joel-xmd-starting-message-apis.vercel.app/");
    const premiumList = res.data?.premiumumusers || [];

    if (!premiumList.includes(senderNumber)) {
      return m.reply("❌ This command is only for *Premium Users*.\nContact admin to upgrade.");
    }

    m.reply("⏳ Fetching adult content...");

    const apiUrl = "https://apis.davidcyriltech.my.id/download/xnxx?url=https://www.xnxx.com/video-jblm1a4/siswetlive.com_fattest_pussy_ive_ever_seen";
    const response = await axios.get(apiUrl);
    const result = response.data?.result;

    if (!result?.download?.high_quality) {
      return m.reply("❌ Failed to fetch video. Try again later.");
    }

    const { title, duration, info, thumbnail, download } = result;

    const messagePayload = {
      video: { url: download.high_quality },
      mimetype: "video/mp4",
      caption: `*${title}*\nDuration: ${duration}s\nInfo: ${info}\n\n_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ_`,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999,
        externalAdReply: {
          title: "JOEL XMD Premium",
          body: "XNX Video • Premium Only",
          thumbnailUrl: thumbnail,
          sourceUrl: "https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    };

    await gss.sendMessage(m.from, messagePayload, { quoted: m });
    m.reply("```XNX video sent. Use responsibly.```");

  } catch (err) {
    console.error("xnx cmd error:", err);
    m.reply("❌ Error fetching video.\n\n" + err.message);
  }
};

export default xnxHandler;
