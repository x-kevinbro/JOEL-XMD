import fs from 'fs';
import pkg from '@whiskeysockets/baileys';
const { proto, downloadContentFromMessage } = pkg;

const { default: config } = await import('../../config.cjs');

const joelContext = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363317462952356@newsletter',
    newsletterName: "✨ ᴊᴏᴇʟ xᴍᴅ ʙᴏᴛ ✨",
    serverMessageId: 143
  }
};

// ==========================
//    ʟᴏʀᴅ ᴊᴏᴇʟ ᴘʀᴏᴛᴇᴄᴛᴏʀ ᴄʟᴀss
// ==========================
class JoelAntiDelete {
  constructor() {
    this.enabled = config.ANTI_DELETE;
    this.messageCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000;
    this.cleanupInterval = setInterval(() => this.cleanExpiredMessages(), this.cacheExpiry);
  }

  cleanExpiredMessages() {
    const now = Date.now();
    for (const [key, msg] of this.messageCache.entries()) {
      if (now - msg.timestamp > this.cacheExpiry) {
        this.messageCache.delete(key);
      }
    }
  }

  formatTime(timestamp) {
    return new Date(timestamp).toLocaleString('en-PK', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }) + ' ⏳';
  }
}

const antiDelete = new JoelAntiDelete();
const statusPath = './joel_antidelete.json';

let statusData = {};
if (fs.existsSync(statusPath)) {
  statusData = JSON.parse(fs.readFileSync(statusPath));
}
if (!statusData.chats) statusData.chats = {};

// ==========================
//         ᴄᴜᴛᴇ ʜᴀɴᴅʟᴇʀ
// ==========================
const AntiDelete = async (m, Matrix) => {
  if (!config.ANTI_DELETE) return;

  const chatId = m.from;
  const prefix = config.PREFIX;

  const formatJid = (jid) => jid ? jid.replace(/@s\.whatsapp\.net|@g\.us/g, '') : 'Unknown';

  const getChatInfo = async (jid) => {
    if (!jid) return { name: 'Unknown Realm', isGroup: false };
    if (jid.includes('@g.us')) {
      try {
        const groupMetadata = await Matrix.groupMetadata(jid);
        return {
          name: groupMetadata?.subject || 'Joel’s Cute Castle',
          isGroup: true
        };
      } catch {
        return { name: 'Joel’s Cute Castle', isGroup: true };
      }
    }
    return { name: 'Private Realm', isGroup: false };
  };

  // Command handling
  const command = m.body.toLowerCase();
  if (command === `${prefix}antidelete on` || command === `${prefix}antidelete off`) {
    const responses = {
      on: {
        text: `✨ *ᴊᴏᴇʟ xᴍᴅ ᴀɴᴛɪ-ᴅᴇʟᴇᴛᴇ ᴀᴄᴛɪᴠᴀᴛᴇᴅ!* ✨\n\n` +
              `• ᴘʀᴏᴛᴇᴄᴛɪᴏɴ: *ᴇɴᴀʙʟᴇᴅ*\n` +
              `• ᴄᴀᴄʜᴇ ᴛɪᴍᴇ: *5 ᴍɪɴᴜᴛᴇs*\n` +
              `• sᴄᴏᴘᴇ: *ᴀʟʟ ʀᴇᴀʟᴍs*\n\n` +
              `_ʀᴇᴄᴏᴠᴇʀɪɴɢ ᴠᴀɴɪsʜᴇᴅ ᴍᴇssᴀɢᴇs..._\n\n` +
              `ꜱᴛᴀʏ ᴄᴜᴛᴇ ~ ᴊᴏᴇʟ ʟᴏᴠᴇs ʏᴏᴜ\n\n(ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ)`,
        contextInfo: joelContext
      },
      off: {
        text: `💤 *ᴊᴏᴇʟ xᴍᴅ ᴀɴᴛɪ-ᴅᴇʟᴇᴛᴇ ᴅɪsᴀʙʟᴇᴅ*\n\n` +
              `_sᴀʏ ɢᴏᴏᴅʙʏᴇ ᴛᴏ ʀᴇᴄᴏᴠᴇʀʏ ᴍᴀɢɪᴄ_\n\n(ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ)`,
        contextInfo: joelContext
      }
    };

    if (command === `${prefix}antidelete on`) {
      statusData.chats[chatId] = true;
      fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
      await Matrix.sendMessage(chatId, responses.on, { quoted: m });
    } else {
      statusData.chats[chatId] = false;
      fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
      antiDelete.messageCache.clear();
      await Matrix.sendMessage(chatId, responses.off, { quoted: m });
    }

    await Matrix.sendReaction(chatId, m.key, '💫');
    return;
  }

  // Cache every incoming message
  if (statusData.chats[chatId]) {
    const keyId = m.key.id;
    antiDelete.messageCache.set(keyId, {
      message: m.message,
      sender: m.key.participant || m.key.remoteJid,
      timestamp: Date.now(),
      pushName: m.pushName || 'Unknown',
      chatId
    });
  }

  // Recover deleted messages
  if (m.message?.protocolMessage?.type === 0 && statusData.chats[chatId]) {
    const deletedKey = m.message.protocolMessage.key.id;
    const original = antiDelete.messageCache.get(deletedKey);

    if (original) {
      const chatInfo = await getChatInfo(chatId);
      const caption = `🗑️ *ᴍᴇssᴀɢᴇ ʀᴇᴄᴏᴠᴇʀᴇᴅ!*\n\n` +
                      `• *ғʀᴏᴍ:* ${original.pushName}\n` +
                      `• *ᴄʜᴀᴛ:* ${chatInfo.name}\n` +
                      `• *ᴛɪᴍᴇ:* ${antiDelete.formatTime(original.timestamp)}\n\n` +
                      `✉️ _ᴏʀɪɢɪɴᴀʟ ᴍᴇssᴀɢᴇ ʙᴇʟᴏᴡ:_`;

      await Matrix.sendMessage(chatId, { text: caption, contextInfo: joelContext });
      await Matrix.sendMessage(chatId, { forward: original.message }, { quoted: m });
      antiDelete.messageCache.delete(deletedKey);
    }
  }
};

export default AntiDelete;
