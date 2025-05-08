import axios from "axios";
import config from '../../config.cjs';

const xnxHandler = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const args = m.body.trim().split(/\s+/).slice(1);
  const query = args.join(" ");

  const validCmds = ["xnx"];
  if (!validCmds.includes(cmd)) return;

  const senderNumber = m.sender.replace(/\D/g, '');

  if (!query) {
    return m.reply("❌ Please provide a search term.\nExample: *.xnx trap*");
  }

  try {
    // Check premium users
    const res = await axios.get("https://joel-xmd-starting-message-apis.vercel.app/");
    const premiumList = res.data?.premiumumusers || [];

    if (!premiumList.includes(senderNumber)) {
      return m.reply("❌ This command is only for *Premium Users*.\nContact admin to upgrade.");
    }

    m.reply("🔍 Searching for NSFW video...");

    // Search for video
    const searchRes = await axios.get(`https://apis.davidcyriltech.my.id/search/xnxx?query=${encodeURIComponent(query)}`);
    const results = searchRes.data?.results;

    if (!results || results.length === 0) {
      return m.reply("❌ No results found. Try a different keyword.");
    }

    const firstResult = results[0];
    const videoUrl = firstResult.link;
    const title = firstResult.title;
    const info = firstResult.info;

    // Download video using its link
    const dlRes = await axios.get(`https://apis.davidcyriltech.my.id/download/xnxx?url=${encodeURIComponent(videoUrl)}`);
    const download = dlRes.data?.result?.download;

    if (!download?.high_quality) {
      return m.reply("❌ Failed to fetch video. Try again later.");
    }

    const messagePayload = {
      video: { url: download.high_quality },
      mimetype: "video/mp4",
      caption: `*${title}*\n${info}\n\n_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ_`,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 777,
        externalAdReply: {
          title: "JOEL XMD NSFW Search",
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
    console.error("XNX cmd error:", error.message);
    m.reply("❌ Something went wrong.\n\n" + error.message);
  }
};

export default xnxHandler;
