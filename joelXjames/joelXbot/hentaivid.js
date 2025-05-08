import axios from "axios";
import config from '../../config.cjs';

const hentaiHandler = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  const validCmds = ["hentaivid", "hentai", "videohentai", "hvid", "hentaivideo"];
  if (!validCmds.includes(cmd)) return;

  const senderNumber = m.sender.replace(/\D/g, '');

  try {
    // Fetch premium numbers dynamically from your API
    const res = await axios.get("https://joel-xmd-starting-message-apis.vercel.app/");
    const premiumList = res.data?.premiumumusers || [];

    if (!premiumList.includes(senderNumber)) {
      return m.reply("❌ This command is only for *Premium Users*.\nContact admin to upgrade.");
    }

    m.reply("⏳ Fetching NSFW content...");

    const response = await axios.get("https://apis.davidcyriltech.my.id/hentai");
    const data = response.data;

    if (!data?.success || !data?.video?.video_1) {
      return m.reply("❌ Failed to fetch video. Try again later.");
    }

    const { title, category, views_count, share_count, video_1 } = data.video;

    const messagePayload = {
      video: { url: video_1 },
      mimetype: "video/mp4",
      caption: `*${title}*\nCategory: ${category}\nViews: ${views_count}\nShares: ${share_count}\n\n_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ_`,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 777,
        externalAdReply: {
          title: "JOEL XMD NSFW",
          body: "Premium Feature • By Lord Joel",
          thumbnailUrl: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/main/mydata/media/joelXbot.jpg',
          sourceUrl: "https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K",
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    };

    await gss.sendMessage(m.from, messagePayload, { quoted: m });
    m.reply("```NSFW video sent. Use responsibly.```");

  } catch (error) {
    console.error("NSFW cmd error:", error.message);
    m.reply("❌ Something went wrong.\n\n" + error.message);
  }
};

export default hentaiHandler;
