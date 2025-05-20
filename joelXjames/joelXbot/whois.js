import config from '../../config.cjs';

const profileCommand = async (m, Matrix) => {
  const prefix = config.PREFIX;
  if (!m.body.startsWith(prefix)) return;

  const args = m.body.slice(prefix.length).trim().split(/\s+/);
  const cmd = args.shift().toLowerCase();

  const validCommands = ['userprofile', 'whois', 'user', 'check'];
  if (!validCommands.includes(cmd)) return; // Ignore invalid command

  // Show usage help if no argument, no mention, and no quote
  const noArgs = args.length === 0;
  const noMention = !m.mentionedJid || m.mentionedJid.length === 0;
  const noQuote = !m.quoted;

  if (noArgs && noMention && noQuote) {
    return await Matrix.sendMessage(m.from, {
      text: `*Usage:*\n.${cmd} @user\n.${cmd} 1234567890\n(You can also reply to a user's message)`,
    }, { quoted: m });
  }

  let target;

  // Case 1: Mentioned user
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    target = m.mentionedJid[0];
  }
  // Case 2: Raw number
  else if (args[0] && /^\d{5,}$/.test(args[0])) {
    target = args[0].replace(/\D/g, '') + "@s.whatsapp.net";
  }
  // Case 3: Quoted message
  else if (m.quoted) {
    target = m.quoted.sender;
  }
  // Case 4: Fallback
  else {
    target = m.sender;
  }

  let name = "@" + target.split("@")[0];

  let ppUrl;
  try {
    ppUrl = await Matrix.profilePictureUrl(target, 'image');
  } catch {
    ppUrl = "https://telegra.ph/file/95680cd03e012bb08b9e6.jpg";
  }

  let status;
  try {
    status = await Matrix.fetchStatus(target);
  } catch {
    status = { status: "User's status is private or unavailable." };
  }

  const mess = {
    image: { url: ppUrl },
    caption: `Name: ${name}\nAbout:\n${status.status}\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊᴏᴇʟ xᴍᴅ*`,
    mentions: [target]
  };

  await Matrix.sendMessage(m.from, mess, { quoted: m });
};

export default profileCommand;
