// Joel XMD Anti-Delete System

import fs from 'fs'; import config from '../../config.cjs'; import pkg from '@whiskeysockets/baileys'; const { proto, downloadContentFromMessage } = pkg;

const xmdContext = { forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363317462952356@newsletter', newsletterName: "ᴊᴏᴇʟ xᴍᴅ ʙᴏᴛ", serverMessageId: 143 } };

class XmdAntiDelete { constructor() { this.enabled = config.ANTI_DELETE; this.messageCache = new Map(); this.cacheExpiry = 5 * 60 * 1000; this.cleanupInterval = setInterval(() => this.cleanExpiredMessages(), this.cacheExpiry); }

cleanExpiredMessages() { const now = Date.now(); for (const [key, msg] of this.messageCache.entries()) { if (now - msg.timestamp > this.cacheExpiry) { this.messageCache.delete(key); } } }

formatTime(timestamp) { const options = { timeZone: 'Asia/Karachi', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }; return new Date(timestamp).toLocaleString('en-PK', options) + ' (PKT)'; } }

const xmdDelete = new XmdAntiDelete(); const statusPath = './xmd_antidelete.json'; let statusData = {}; if (fs.existsSync(statusPath)) statusData = JSON.parse(fs.readFileSync(statusPath)); if (!statusData.chats) statusData.chats = {};

const AntiDelete = async (m, Matrix) => { const chatId = m.from; const formatJid = (jid) => jid ? jid.replace(/@s.whatsapp.net|@g.us/g, '') : 'Unknown';

const getChatInfo = async (jid) => { if (!jid) return { name: 'Unknown Chat', isGroup: false }; if (jid.includes('@g.us')) { try { const groupMetadata = await Matrix.groupMetadata(jid); return { name: groupMetadata?.subject || 'Unnamed Group', isGroup: true }; } catch { return { name: 'Unnamed Group', isGroup: true }; } } return { name: 'Private Chat', isGroup: false }; };

if (m.body.toLowerCase() === ${config.PREFIX}antidelete on || m.body.toLowerCase() === ${config.PREFIX}antidelete off) { const responses = { on: { text: ┏━━━〔 ᴊᴏᴇʟ ᴘʀᴏᴛᴏᴄᴏʟ: ᴀɴᴛɪ-ᴅᴇʟᴇᴛᴇ ᴏɴ 〕━━━┓\n┃  \n┃  ☑️  *ꜱᴛᴀᴛᴜꜱ:* ᴇɴᴀʙʟᴇᴅ\n┃  ⏱️  *ᴄᴀᴄʜᴇ:* 5 ᴍɪɴᴜᴛᴇꜱ\n┃  ✨  *ꜱᴄᴏᴘᴇ:* ᴀʟʟ ᴄʜᴀᴛꜱ\n┃  \n┃  _ɴᴏ ᴍᴏʀᴇ ʜɪᴅɪɴɢ ᴍᴇꜱꜱᴀɢᴇꜱ~_\n┃  \n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛, contextInfo: xmdContext }, off: { text: ┏━━━〔 ᴊᴏᴇʟ ꜱʏꜱᴛᴇᴍ ᴜᴘᴅᴀᴛᴇ 〕━━━┓\n┃  \n┃  ❌  *ꜱᴛᴀᴛᴜꜱ:* ᴅɪꜱᴀʙʟᴇᴅ\n┃  \n┃  _ᴀʟʟ ᴍᴇꜱꜱᴀɢᴇꜱ ɴᴏᴡ ᴠᴀɴɪꜱʜ ɪɴ ᴘᴇᴀᴄᴇ..._\n┃  \n┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛, contextInfo: xmdContext } };

const isOn = m.body.toLowerCase() === `${config.PREFIX}antidelete on`;
statusData.chats[chatId] = isOn;
fs.writeFileSync(statusPath, JSON.stringify(statusData, null, 2));
xmdDelete.enabled = isOn;
if (!isOn) xmdDelete.messageCache.clear();

await Matrix.sendMessage(m.from, isOn ? responses.on : responses.off, { quoted: m });
await Matrix.sendReaction(m.from, m.key, '🛡️');
return;

}

Matrix.ev.on('messages.upsert', async ({ messages }) => { if (!xmdDelete.enabled || !messages?.length) return;

for (const msg of messages) {
  if (msg.key.fromMe || !msg.message || msg.key.remoteJid === 'status@broadcast') continue;

  try {
    const content = msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      msg.message.videoMessage?.caption ||
      msg.message.documentMessage?.caption;

    let media, type, mimetype;
    const mediaTypes = ['image', 'video', 'audio', 'sticker', 'document'];

    for (const mediaType of mediaTypes) {
      if (msg.message[`${mediaType}Message`]) {
        const mediaMsg = msg.message[`${mediaType}Message`];
        try {
          const stream = await downloadContentFromMessage(mediaMsg, mediaType);
          let buffer = Buffer.from([]);
          for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
          media = buffer;
          type = mediaType;
          mimetype = mediaMsg.mimetype;
          break;
        } catch {}
      }
    }

    if (msg.message.audioMessage?.ptt) {
      try {
        const stream = await downloadContentFromMessage(msg.message.audioMessage, 'audio');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        media = buffer;
        type = 'voice';
        mimetype = msg.message.audioMessage.mimetype;
      } catch {}
    }

    if (content || media) {
      xmdDelete.messageCache.set(msg.key.id, {
        content,
        media,
        type,
        mimetype,
        sender: msg.key.participant || msg.key.remoteJid,
        senderFormatted: `@${formatJid(msg.key.participant || msg.key.remoteJid)}`,
        timestamp: Date.now(),
        chatJid: msg.key.remoteJid
      });
    }
  } catch {}
}

});

Matrix.ev.on('messages.update', async (updates) => { if (!xmdDelete.enabled || !updates?.length) return;

for (const update of updates) {
  try {
    const { key, update: updateData } = update;
    const isDeleted = updateData?.messageStubType === proto.WebMessageInfo.StubType.REVOKE ||
      updateData?.status === proto.WebMessageInfo.Status.DELETED;

    if (!isDeleted || key.fromMe || !xmdDelete.messageCache.has(key.id)) continue;

    const cachedMsg = xmdDelete.messageCache.get(key.id);
    xmdDelete.messageCache.delete(key.id);

    const chatInfo = await getChatInfo(cachedMsg.chatJid);
    const deletedBy = updateData?.participant ?
      `@${formatJid(updateData.participant)}` :
      (key.participant ? `@${formatJid(key.participant)}` : 'ᴜɴᴋɴᴏᴡɴ');

    const messageType = cachedMsg.type ?
      cachedMsg.type.charAt(0).toUpperCase() + cachedMsg.type.slice(1) :
      'Message';

    const baseInfo = `┏━〔 ᴍᴇꜱꜱᴀɢᴇ ʀᴇᴄᴏᴠᴇʀᴇᴅ ʙʏ ᴊᴏᴇʟ ʙᴏᴛ 〕━┓\n┃\n┃  👤 *ꜱᴇɴᴛ ʙʏ:* ${cachedMsg.senderFormatted}\n┃  🗑️ *ᴅᴇʟᴇᴛᴇᴅ ʙʏ:* ${deletedBy}\n┃  💬 *ᴄʜᴀᴛ:* ${chatInfo.name}${chatInfo.isGroup ? ' (ɢʀᴏᴜᴘ)' : ''}\n┃  🕓 *ꜱᴇɴᴛ:* ${xmdDelete.formatTime(cachedMsg.timestamp)}\n┃  ❌ *ᴅᴇʟᴇᴛᴇᴅ:* ${xmdDelete.formatTime(Date.now())}\n┃\n┃  _ᴏᴏᴘꜱ~ ɪ ɢᴏᴛ ʏᴏᴜʀ ᴅᴇʟᴇᴛᴇᴅ ᴛᴇxᴛ!_\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

    if (cachedMsg.media) {
      await Matrix.sendMessage(cachedMsg.chatJid, {
        [cachedMsg.type]: cachedMsg.media,
        mimetype: cachedMsg.mimetype,
        caption: baseInfo,
        contextInfo: xmdContext
      });
    } else if (cachedMsg.content) {
      await Matrix.sendMessage(cachedMsg.chatJid, {
        text: `${baseInfo}\n\n📜 *Message:* \n${cachedMsg.content}`,
        contextInfo: xmdContext
      });
    }
  } catch {}
}

}); };

export default AntiDelete;

  
