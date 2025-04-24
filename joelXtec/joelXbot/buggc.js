import fs from "fs";
import path from "path";
import config from "../../config.cjs";
import bugtext1 from "../../bugs/bugtext1.js"; // Import the VCF name

const vcfCompiler = async (m, gss, sock) => {
  try {
    const cmd = m.body.toLowerCase().trim();
    if (!cmd.startsWith(config.PREFIX)) return;

    const command = cmd.slice(config.PREFIX.length).trim();
    if (command !== "bg") return;

    if (!m.isGroup) {
      return m.reply("*THIS COMMAND CAN ONLY BE USED IN GROUPS!*");
    }

    m.reply("*ᴊᴏᴇʟ xᴍᴅ ɪs ᴄᴏᴍᴘɪʟɪɴɢ ʏᴏᴜʀ ɢʀᴏᴜᴘ ᴄᴏɴᴛᴀᴄᴛs...*");

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;

    if (!participants.length) {
      return m.reply("*⚠️ No contacts found in this group*");
    }

    let vcfContent = `BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp Group Contacts\nEND:VCARD\n`;

    participants.forEach((member) => {
      const number = member.id.split("@")[0];
      const name = member.notify || member.name || `Unknown ${number}`;

      vcfContent += `
BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=CELL:+${number}
END:VCARD`;
    });

    const fileName = bugtext1.replace(/\s+/g, "_"); // Replace spaces with underscores
    const vcfPath = path.join("/tmp", `${fileName}.vcf`);
    fs.writeFileSync(vcfPath, vcfContent, "utf8");

    await gss.sendMessage(m.from, {
      document: { url: vcfPath },
      mimetype: "text/x-vcard",
      fileName: `${bugtext1}~By Lord Joel`
    });

    const responseText = "*✅ Contact list compiled successfully! Download and import it into your phone or Gmail.*";

    sock.sendMessage(
      m.from,
      {
        text: responseText,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363317462952356@newsletter',
            newsletterName: "ᴊᴏᴇʟ xᴍᴅ ʙᴏᴛ",
            serverMessageId: -1,
          },
          forwardingScore: 999,
          externalAdReply: {
            title: "ᴊᴏᴇʟ xᴍᴅ ʙᴏᴛ ᴠ¹⁰",
            body: "ᴘɪɴɢ sᴘᴇᴇᴅ ᴄᴀʟᴄᴜʟᴀᴛɪᴏɴs",
            thumbnailUrl: 'https://avatars.githubusercontent.com/u/162905644?v=4',
            sourceUrl: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
            mediaType: 1,
            renderLargerThumbnail: false,
          },
        },
      },
      { quoted: m }
    );

    m.reply(`*✅ File named:* *『 ${bugtext1} 』* *has been generated successfully.*`);

  } catch (error) {
    console.error("Error in VCF Compilation:", error);
    m.reply("*⚠️ An error occurred while compiling contacts.*");
  }
};

export default vcfCompiler;
