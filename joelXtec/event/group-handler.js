import moment from 'moment-timezone';
import config from '../../config.cjs';

export default async function GroupParticipants(sock, { id, participants, action }) {
   try {
      const metadata = await sock.groupMetadata(id);

      for (const jid of participants) {
         // Get user profile picture (with fallback)
         let profile = "https://i.ibb.co/6Yj5bT2/default-pfp.jpg";
         try {
            profile = await sock.profilePictureUrl(jid, "image");
         } catch {
            console.warn(`⚠️ Couldn't fetch profile pic for ${jid}. Using default.`);
         }

         const userName = jid.split('@')[0];
         const membersCount = metadata.participants.length;

         // WELCOME MESSAGE
         if (action === "add" && config.WELCOME) {
            const joinTime = moment.tz('Africa/Kolkata').format('HH:mm:ss');
            const joinDate = moment.tz('Asia/Tanzania').format('DD/MM/YYYY');
            await sock.sendMessage(id, {
               text: `╭───〔 *ᴊᴏᴇʟ ᴡᴇʟᴄᴏᴍᴇ ᴢᴏɴᴇ* 〕───╮
│  
│  ✦ ʜᴇʏ @${userName}!
│  ✦ ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ *${metadata.subject}*
│  ✦ ʏᴏᴜ'ʀᴇ ᴏᴜʀ ${membersCount}ᴛʜ ᴍᴇᴍʙᴇʀ
│  ✦ ᴊᴏɪɴᴇᴅ: ${joinTime} | ${joinDate}
│  
╰─────────────────────━⊷`,
               contextInfo: {
                  mentionedJid: [jid],
                  externalAdReply: {
                     title: `ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴛʜᴇ ꜰᴀᴍ!`,
                     mediaType: 1,
                     previewType: 0,
                     renderLargerThumbnail: true,
                     thumbnailUrl: profile,
                     sourceUrl: 'https://github.com/joeljamestech2/JOEL-XMD'
                  }
               }
            });

         // GOODBYE MESSAGE
         } else if (action === "remove" && config.WELCOME) {
            const leaveTime = moment.tz('Africa/Tanzania').format('HH:mm:ss');
            const leaveDate = moment.tz('Africa/Tanzania').format('DD/MM/YYYY');
            await sock.sendMessage(id, {
               text: `╭──〔 *ᴊᴏᴇʟ ɢᴏᴏᴅʙʏᴇ ᴘᴏʀᴛᴀʟ* 〕──╮
│  
│  ✦ ꜰᴀʀᴇᴡᴇʟʟ @${userName}
│  ✦ ʏᴏᴜ ʟᴇғᴛ *${metadata.subject}*
│  ✦ ɴᴏᴡ ᴡᴇ ᴀʀᴇ ${membersCount} sᴛʀᴏɴɢ
│  ✦ ʟᴇꜰᴛ ᴀᴛ: ${leaveTime} | ${leaveDate}
│  
╰─────────────────────━⊷`,
               contextInfo: {
                  mentionedJid: [jid],
                  externalAdReply: {
                     title: `ɢᴏᴏᴅʙʏᴇ ꜱᴏʟᴅɪᴇʀ`,
                     mediaType: 1,
                     previewType: 0,
                     renderLargerThumbnail: true,
                     thumbnailUrl: profile,
                     sourceUrl: 'https://github.com/joeljamestech2/JOEL-XMD'
                  }
               }
            });
         }
      }
   } catch (e) {
      console.error("GroupParticipants error:", e);
      throw e;
   }
}
