import config from '../../config.cjs';

const profileCommand = async (m, Matrix) => {
  const prefix = config.PREFIX;
  if (!m.body.startsWith(prefix)) return;

  const args = m.body.slice(prefix.length).trim().split(/\s+/);
  const cmd = args.shift().toLowerCase();

  if (cmd === 'profile') {
    let sender;

    if (m.mentionedJid?.length) {
      sender = m.mentionedJid[0];
    } else if (args[0] && /^\d{5,}$/.test(args[0])) {
      sender = args[0].replace(/\D/g, '') + '@s.whatsapp.net';
    } else if (m.quoted) {
      sender = m.quoted.sender;
    } else {
      sender = m.sender;
    }

    let name;
    try {
      const vcard = await Matrix.getContact(sender);
      name = vcard?.notify || "@" + sender.split("@")[0];
    } catch {
      name = "@" + sender.split("@")[0];
    }

    let ppUrl;
    try {
      ppUrl = await Matrix.profilePictureUrl(sender, 'image');
    } catch {
      ppUrl = "https://telegra.ph/file/95680cd03e012bb08b9e6.jpg";
    }

    let status;
    try {
      status = await Matrix.fetchStatus(sender);
    } catch {
      status = { status: "User's status is private or unavailable." };
    }

    const mess = {
      image: { url: ppUrl },
      caption: `Name: ${name}\nAbout:\n${status.status}\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊᴏᴇʟ xᴍᴅ*`,
      mentions: [sender]
    };

    await Matrix.sendMessage(m.from, mess, { quoted: m });
  }
};

export default profileCommand;
