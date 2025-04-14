import moment from 'moment-timezone';
import fs from 'fs';
import os from 'os';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import config from '../../config.cjs';

const joel = async (m, sock) => {
  const prefix = config.PREFIX;
  const mode = config.MODE;
  const pushName = m.pushName || 'User';

  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmd === "wacha" || cmd === "kill" || cmd === "location") {
    await m.React('⏳'); // Loading reaction

    // Calculate uptime
    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / (24 * 3600));
    const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    // Get real time
    const time2 = moment().tz("Tanzania/Dodoma").format("HH:mm:ss");
    let pushwish = "";

    if (time2 < "05:00:00") {
      pushwish = `Good Morning 🌄`;
    } else if (time2 < "11:00:00") {
      pushwish = `Good Morning 🌄`;
    } else if (time2 < "15:00:00") {
      pushwish = `Good Afternoon 🌅`;
    } else if (time2 < "18:00:00") {
      pushwish = `Good Evening 🌃`;
    } else if (time2 < "19:00:00") {
      pushwish = `Good Evening 🌃`;
    } else {
      pushwish = `Good Night 🌌`;
    }

    const captionText = `Ø‚Ù†ØƒØ„Ù½Ø‚Ù†ØƒØ„Ù½${"ꦾ".repeat(100)}`; // kept reasonable

    await m.React('☄️'); // Success reaction

    // Send view-once live location
    await sock.sendMessage(
      m.from,
      {
        viewOnceMessage: {
          message: {
            liveLocationMessage: {
              degreesLatitude: 6.7924, // Example: Dar es Salaam
              degreesLongitude: 39.2083,
              caption: captionText,
              sequenceNumber: "0",
              timeOffset: 0,
              jpegThumbnail: Buffer.from(''), // Optional base64 image
            },
          },
        },
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ",
            body: `${pushwish}\nUPTIME ${days}D ${hours}H ${minutes}M ${seconds}S`,
            thumbnailUrl: 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/alive.jpg',
            sourceUrl: 'https://whatsapp.com/channel/0029Vak2PevK0IBh2pKJPp2K',
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    );
  }
};

export default joel;
