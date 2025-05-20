import fs from 'fs'; import path from 'path'; import config from '../../config.cjs';

const validCommands = [ 'blowjob', 'cuckold', 'eba', 'foot', 'milf', 'pussy', 'Yuri', 'zettai' ];

const allowedPath = path.resolve('../../mydata/nsfw/allowedgc.json');

const nsfwCmd = async (m, sock, groupMetadata) => { const prefix = config.PREFIX; const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

const isGroup = !!m.isGroup; const groupId = m.from; const sender = m.sender;

// Check and parse allowed group list let allowedGroups = []; if (fs.existsSync(allowedPath)) { try { allowedGroups = JSON.parse(fs.readFileSync(allowedPath)); } catch (e) { allowedGroups = []; } }

// Handle NSFW toggle if (cmd === 'nsfw') { const action = m.body.split(' ')[1]?.toLowerCase(); const isAdmin = groupMetadata?.participants?.find(p => p.id === sender)?.admin;

if (!isGroup) return;
if (!isAdmin) {
  await sock.sendMessage(m.from, { text: `Only admins can enable/disable NSFW.` }, { quoted: m });
  return;
}

if (action === 'on') {
  if (!allowedGroups.includes(groupId)) allowedGroups.push(groupId);
  fs.writeFileSync(allowedPath, JSON.stringify(allowedGroups, null, 2));
  await sock.sendMessage(m.from, { text: `✅ NSFW feature enabled in this group.` }, { quoted: m });
  return;
} else if (action === 'off') {
  allowedGroups = allowedGroups.filter(id => id !== groupId);
  fs.writeFileSync(allowedPath, JSON.stringify(allowedGroups, null, 2));
  await sock.sendMessage(m.from, { text: `❌ NSFW feature disabled in this group.` }, { quoted: m });
  return;
}

}

if (!validCommands.includes(cmd)) return;

// Check permission if (!isGroup || !allowedGroups.includes(groupId)) { await sock.sendMessage(m.from, { text: `⚠️ This feature is not enabled in this group.

Type ${prefix}nsfw on to enable.` }, { quoted: m }); return; }

// Load images const filePath = path.resolve(../../joel-xmd-medias/nsfw/${cmd}.json); let imageList;

try { const rawData = fs.readFileSync(filePath, 'utf8'); const parsedData = JSON.parse(rawData); imageList = parsedData.filter(item => item && typeof item.url === 'string').map(item => item.url); if (!imageList.length) throw new Error('Empty list'); } catch (err) { console.error(Error loading NSFW ${cmd}:, err); await sock.sendMessage(m.from, { text: ⚠️ Failed to load ${cmd} images. }, { quoted: m }); return; }

const selectedImage = imageList[Math.floor(Math.random() * imageList.length)]; const caption = 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ';

const messagePayload = { image: { url: selectedImage }, caption: caption, contextInfo: { isForwarded: true, forwardingScore: 999, forwardedNewsletterMessageInfo: { newsletterJid: '120363317462952356@newsletter', newsletterName: "ᴊᴏᴇʟ xᴅ ʙᴏᴛ", serverMessageId: -1, }, externalAdReply: { title: "ᴊᴏᴇʟ xᴅ ʙᴏᴛ", body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ", thumbnailUrl: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/joelXbot.jpg', sourceUrl: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K', mediaType: 1, renderLargerThumbnail: false, }, }, };

await sock.sendMessage(m.from, messagePayload, { quoted: m }); };

export default nsfwCmd;

