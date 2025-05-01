import config from "../../config.cjs";

const antilinkDB = new Map(); // Temporary in-memory DB

const antiLink = async (m, gss) => {
  try {
    const cmd = m.body?.toLowerCase()?.trim();

    // Auto-enable anti-link for all groups if global toggle is on
    if (config.ANTILINK && m.isGroup && !antilinkDB.has(m.from)) {
      antilinkDB.set(m.from, true);
    }

    const isGroup = m.isGroup;
    const groupId = m.from;

    if (["antilink on", "antilink enable"].includes(cmd)) {
      if (!isGroup) return m.reply("╭─❍ *GROUP ONLY*\n│  This command works only in groups!\n╰─────────────━⊷");

      const groupMetadata = await gss.groupMetadata(groupId);
      const isAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin;

      if (!isAdmin) return m.reply("╭─❍ *INSUFFICIENT PERMISSION*\n│  Only admins can enable Anti-Link!\n╰─────────────━⊷");

      antilinkDB.set(groupId, true);
      return m.reply("╭─❍ *ANTILINK ENABLED*\n│  Links will now be auto-deleted!\n╰─────────────━⊷");
    }

    if (["antilink off", "antilink disable"].includes(cmd)) {
      if (!isGroup) return m.reply("╭─❍ *GROUP ONLY*\n│  This command works only in groups!\n╰─────────────━⊷");

      const groupMetadata = await gss.groupMetadata(groupId);
      const isAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin;

      if (!isAdmin) return m.reply("╭─❍ *INSUFFICIENT PERMISSION*\n│  Only admins can disable Anti-Link!\n╰─────────────━⊷");

      antilinkDB.delete(groupId);
      return m.reply("╭─❍ *ANTILINK DISABLED*\n│  Link protection has been turned off.\n╰─────────────━⊷");
    }

    // Auto-delete link if active
    if (antilinkDB.get(groupId)) {
      const linkRegex = /(https?:\/\/[^\s]+|chat\.whatsapp\.com\/[^\s]+|wa\.me\/[^\s]+|t\.me\/[^\s]+)/gi;
      if (linkRegex.test(m.body)) {
        const groupMetadata = await gss.groupMetadata(groupId);
        const isAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin;

        if (!isAdmin) {
          await gss.sendMessage(groupId, { delete: m.key });
          return m.reply("╭─❍ *LINK BLOCKED*\n│  Links are not allowed in this group!\n╰─────────────━⊷");
        }
      }
    }
  } catch (err) {
    console.error("Joel-XMD | Anti-Link Error:", err);
    m.reply("╭─❍ *ERROR*\n│  Something went wrong while handling Anti-Link!\n╰─────────────━⊷");
  }
};

export default antiLink;
