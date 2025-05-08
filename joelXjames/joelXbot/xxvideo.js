import axios from "axios";
import config from '../../config.cjs';

const xxvideoHandler = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const args = m.body.trim().split(/\s+/).slice(1);
  const query = args.join(" ");

  if (cmd !== "xxvideo") return;

  const senderNumber = m.sender.replace(/\D/g, '');

  if (!query) {
    return m.reply("❌ Please provide a search query.\nExample: *.xxvideo mia khalifa*");
  }

  try {
    // Premium check
    const res = await axios.get("https://joel-xmd-starting-message-apis.vercel.app/");
    const premiumList = res.data?.premiumumusers || [];

    if (!premiumList.includes(senderNumber)) {
      return m.reply("❌ This command is only for *Premium Users*.\nContact admin to upgrade.");
    }

    m.reply("⏳ Searching for video...");

    // Step 1: Search for video
    const searchApi = `https://apis.davidcyriltech.my.id/search/xvideo?text=${encodeURIComponent(query)}`;
    const searchRes = await axios.get(searchApi);
    const firstResultUrl = searchRes.data?.result?.[0]?.url;

    if (!firstResultUrl) {
      return m.reply("❌ No video found for your query.");
    }

    // Step 2: Get video info
    const api = `https://apis.davidcyriltech.my.id/xvideo?url=${encodeURIComponent(firstResultUrl)}`;
    const response = await axios.get(api);
    const result = response.data;

    if (!result?.download_url) {
      return m.reply("❌ Failed to retrieve video. Try again later.");
    }

    const messagePayload = {
      video: { url: result.download_url },
      mimetype: "video/mp4",
      caption: `*${result.title}*\n\n_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ_`,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 777,
        externalAdReply: {
          title: "JOEL XMD Xvideos Downloader",
          body: "Premium Feature • By Lord Joel",
          thumbnailUrl: result.thumbnail || '',
          sourceUrl: firstResultUrl,
          mediaType: 1,
          renderLargerThumbnail: true 
        }
      }
    };

    await gss.sendMessage(m.from, messagePayload, { quoted: m });
    m.reply("```Video sent. Use responsibly.```");

  } catch (err) {
    console.error("XXVideo Cmd Error:", err.message);
    m.reply("❌ An error occurred:\n" + err.message);
  }
};

export default xxvideoHandler;
