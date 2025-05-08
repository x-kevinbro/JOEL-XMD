import axios from "axios";
import config from '../../config.cjs';

const hentaiVid = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  if (cmd === "hentaivid") {
    try {
      m.reply("⏳ Fetching some spicy content...");

      const response = await axios.get("https://apis.davidcyriltech.my.id/hentai");
      const data = response.data;

      if (!data?.success || !data?.video?.video_1) {
        return m.reply("❌ Failed to retrieve video. Try again later.");
      }

      const { title, category, views_count, share_count, video_1 } = data.video;

      const messagePayload = {
        video: { url: video_1 },
        mimetype: "video/mp4",
        caption: `*${title}*\n\nCategory: ${category}\nViews: ${views_count}\nShares: ${share_count}\n\n_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ_`,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 500,
          externalAdReply: {
            title: "JOEL XMD - Hentai Module",
            body: "Powered by Lord Joel",
            thumbnailUrl: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/main/mydata/media/joelXbot.jpg',
            sourceUrl: "https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      };

      await gss.sendMessage(m.from, messagePayload, { quoted: m });
      m.reply("```Enjoy your video. Stay classy!```");

    } catch (error) {
      console.error("hentaivid error:", error.message);
      m.reply("❌ An error occurred while fetching video.\n\n" + error.message);
    }
  }
};

export default hentaiVid;
