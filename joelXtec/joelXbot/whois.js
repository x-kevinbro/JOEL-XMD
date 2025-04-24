import config from '../../config.cjs';

const profileCommand = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === 'profile' || cmd === 'whois') {
    let sender = m.quoted ? m.quoted.sender : m.sender;
    let name = m.quoted ? "@" + sender.split("@")[0] : (m.pushName || "Unknown");

    let ppUrl;
    try {
      ppUrl = await Matrix.profilePictureUrl(sender, 'image');
    } catch {
      ppUrl = "https://telegra.ph/file/95680cd03e012bb08b9e6.jpg";
    }

    let status;
    try {
      status = await Matrix.fetchStatus(sender);
    } catch (error) {
      status = { status: "About not accessible due to user privacy" };
    }

    const caption = `╭──❍ *ᴘʀᴏғɪʟᴇ ɪɴғᴏ* ❍──╮
│  *Name:* ${name}
│  *About:* ${status.status}
╰───────────────━⊷

╭─「 *ᴊᴏᴇʟ xᴍᴅ ɴᴇᴡꜱ* 」─╮
│ Stay tuned for new features,
│ epic commands, and secret drops!
│ Join our channel for updates:
│ t.me/joelxmdnews
╰───────────────━⊷

*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊᴏᴇʟ xᴍᴅ*`;

    const messagePayload = {
      image: { url: ppUrl },
      caption,
      thumbnail: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/joelXbot.jpg',
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363317462952356@newsletter',
          newsletterName: "ᴊᴏᴇʟ xmᴅ ʙᴏᴛ",
          serverMessageId: 143,
        },
        externalAdReply: {
          title: "ᴊᴏᴇʟ xmᴅ ʙᴏᴛ",
          body: "Powered by Lord Joel 🌟",
          thumbnailUrl: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/joelXbot.jpg',
          sourceUrl: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
          mediaType: 1,
          renderLargerThumbnail: false,
        },
      },
      ...(m.quoted ? { mentions: [sender] } : {})
    };

    await Matrix.sendMessage(m.from, messagePayload, { quoted: m });
  }
};

export default profileCommand;
