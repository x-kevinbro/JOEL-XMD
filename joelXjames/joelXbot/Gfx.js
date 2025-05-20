import config from '../../config.cjs';

const wantedCommand = async (m, Matrix) => {
  const prefix = config.PREFIX;
  if (!m.body.startsWith(prefix)) return;

  const args = m.body.slice(prefix.length).trim().split(/\s+/);
  const cmd = args.shift().toLowerCase();

  const validCommands = ['wanted'];
  if (!validCommands.includes(cmd)) return;

  const noArgs = args.length === 0;
  const noMention = !m.mentionedJid || m.mentionedJid.length === 0;
  const noQuote = !m.quoted;

  if (noArgs && noMention && noQuote) {
    return await Matrix.sendMessage(m.from, {
      text: `*Usage:*\n${prefix}${cmd} 255714595078`,
    }, { quoted: m });
  }

  let target;

  if (m.mentionedJid && m.mentionedJid.length > 0) {
    target = m.mentionedJid[0];
  } else if (args[0] && /^\d{5,}$/.test(args[0])) {
    target = args[0].replace(/\D/g, '') + "@s.whatsapp.net";
  } else if (m.quoted) {
    target = m.quoted.sender;
  } else {
    target = m.sender;
  }

  let ppUrl;
  let timedOut = false;

  const timeout = setTimeout(async () => {
    timedOut = true;
    await Matrix.sendMessage(m.from, {
      text: `⚠️ Please provide a valid WhatsApp number without '+'\nExample: \`\`\`255781144539\`\`\``,
    }, { quoted: m });
  }, 8000);

  try {
    ppUrl = await Matrix.profilePictureUrl(target, 'image');
  } catch {
    ppUrl = "https://telegra.ph/file/95680cd03e012bb08b9e6.jpg";
  }

  clearTimeout(timeout);

  if (timedOut) return; // already replied

  const wantedImage = `https://api.nexoracle.com/image-processing/wanted?apikey=33241c3a8402295fdc&img=${encodeURIComponent(ppUrl)}`;

  const mess = {
    image: { url: wantedImage },
    caption: `*WANTED!*\nTarget: @${target.split("@")[0]}\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊᴏᴇʟ xᴍᴅ*`,
    mentions: [target],
    contextInfo: {
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363317462952356@newsletter',
        newsletterName: 'ᴊᴏᴇʟ xᴅ ʙᴏᴛ',
        serverMessageId: -1,
      },
      externalAdReply: {
        title: 'ᴊᴏᴇʟ xᴅ ʙᴏᴛ',
        body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ',
        thumbnailUrl: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/joelXbot.jpg',
        sourceUrl: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
        mediaType: 1,
        renderLargerThumbnail: false,
      }
    }
  };

  await Matrix.sendMessage(m.from, mess, { quoted: m });
};

export default wantedCommand;
