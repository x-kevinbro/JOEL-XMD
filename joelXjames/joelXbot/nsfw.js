import fs from 'fs';
import path from 'path';
import config from '../../config.cjs';

const allowedFilePath = path.resolve('../../mydata/nsfw/allowedgc.json');
const nsfwDir = '../../joel-xmd-medias/nsfw';

const validNsfwCmds = [
  'blowjob', 'cuckold', 'eba', 'foot',
  'milf', 'pussy', 'yuri', 'zettai'
];

const nsfwCmd = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmdText = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).trim().split(' ')
    : [];
  const cmd = cmdText[0]?.toLowerCase();
  const option = cmdText[1]?.toLowerCase();
  const groupId = m.from;
  const senderId = m.sender;

  if (!m.key?.remoteJid?.endsWith('@g.us')) {
    await sock.sendMessage(groupId, { text: '❌ NSFW commands are for groups only.' }, { quoted: m });
    return;
  }

  // Load or initialize allowed group list
  let allowedGroups = [];
  try {
    allowedGroups = JSON.parse(fs.readFileSync(allowedFilePath, 'utf8'));
  } catch {
    allowedGroups = [];
  }

  const isAllowed = allowedGroups.includes(groupId);

  // Toggle NSFW with "nsfw on"/"nsfw off"
  if (cmd === 'nsfw' && (option === 'on' || option === 'off')) {
    const metadata = await sock.groupMetadata(groupId);
    const admins = metadata.participants.filter(p => p.admin !== null).map(p => p.id);

    if (!admins.includes(senderId)) {
      await sock.sendMessage(groupId, { text: '❌ Only group admins can toggle NSFW.' }, { quoted: m });
      return;
    }

    if (option === 'on') {
      if (!isAllowed) {
        allowedGroups.push(groupId);
        fs.writeFileSync(allowedFilePath, JSON.stringify(allowedGroups, null, 2));
      }
      await sock.sendMessage(groupId, { text: '✅ NSFW features enabled in this group.' }, { quoted: m });
    } else {
      if (isAllowed) {
        allowedGroups = allowedGroups.filter(id => id !== groupId);
        fs.writeFileSync(allowedFilePath, JSON.stringify(allowedGroups, null, 2));
      }
      await sock.sendMessage(groupId, { text: '🚫 NSFW features disabled in this group.' }, { quoted: m });
    }

    return;
  }

  // Handle actual NSFW commands
  if (!validNsfwCmds.includes(cmd)) return;

  if (!isAllowed) {
    await sock.sendMessage(groupId, {
      text: `⚠️ NSFW feature is not enabled in this group.\n\nType *${prefix}nsfw on* to enable.`,
    }, { quoted: m });
    return;
  }

  const filePath = path.resolve(`${nsfwDir}/${cmd}.json`);
  let imageList;

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw);
    imageList = json
      .filter(item => item && typeof item.url === 'string')
      .map(item => item.url);
    if (!imageList.length) throw new Error(`Empty or invalid list for ${cmd}`);
  } catch (e) {
    console.error(e);
    await sock.sendMessage(groupId, { text: `⚠️ Failed to load NSFW content for "${cmd}".` }, { quoted: m });
    return;
  }

  const randomImage = imageList[Math.floor(Math.random() * imageList.length)];

  const messagePayload = {
    image: { url: randomImage },
    caption: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ',
    contextInfo: {
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363317462952356@newsletter',
        newsletterName: "ᴊᴏᴇʟ xᴅ ʙᴏᴛ",
        serverMessageId: -1,
      },
      externalAdReply: {
        title: "ᴊᴏᴇʟ xᴅ ʙᴏᴛ",
        body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ",
        thumbnailUrl:
          'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/joelXbot.jpg',
        sourceUrl: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
        mediaType: 1,
        renderLargerThumbnail: false,
      },
    },
  };

  await sock.sendMessage(groupId, messagePayload, { quoted: m });
};

export default nsfwCmd;
