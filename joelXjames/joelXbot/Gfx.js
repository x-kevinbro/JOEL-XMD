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
      text: `*Usage:*\n.wanted @user\n.wanted 1234567890\n(You can also reply to a user's message)`,
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
  try {
    ppUrl = await Matrix.profilePictureUrl(target, 'image');
  } catch {
    ppUrl = "https://telegra.ph/file/95680cd03e012bb08b9e6.jpg";
  }

  const wantedImage = `https://api.nexoracle.com/image-processing/wanted?apikey=33241c3a8402295fdc&img=${encodeURIComponent(ppUrl)}`;

  const mess = {
    image: { url: wantedImage },
    caption: `*WANTED!*\nTarget: @${target.split("@")[0]}\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊᴏᴇʟ xᴍᴅ*`,
    mentions: [target]
  };

  await Matrix.sendMessage(m.from, mess, { quoted: m });
};

export default wantedCommand;
