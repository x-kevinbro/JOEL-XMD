
// joel Xmd config.js
const fs = require("fs");
require("dotenv").config();

const config = {
  SESSION_ID: process.env.SESSION_ID || "JOEL-XMD~wQBVlbgB#EbixLm3FRIV35xAuEWAbzKiVbUHcYfLYHeHIqsuNd5A",
  PREFIX: process.env.PREFIX || '.',
//let's add menu captions by lord joel
   BOT_NAME: process.env.BOT_NAME || "ᴊᴏᴇʟ xᴍᴅ ʙᴏᴛ ᴠ¹⁰",
   BOT: process.env.BOT || "hello 👋",
  // lets add new cmd by lord joel
  NEW_CMD: process.env.NEW_CMD || "ᴀᴅᴅᴠᴀʀ\n│ sᴜᴅᴏ\n| joel",
  CAPTION: process.env.CAPTION|| "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ",
// don't use my codes without a permission 🙏
  AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN !== undefined ? process.env.AUTO_STATUS_SEEN === 'true' : true,
  AUTO_BIO: process.env.AUTO_BIO !== undefined ? process.env.AUTO_BIO === 'false' : true,
  AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT !== undefined ? process.env.AUTO_STATUS_REACT === 'true' : true,
  /*anti left by joel xd tech*/
  ANTI_LEFT: process.env.ANTI_LEFT !== undefined ? process.env.ANTI_LEFT === 'false' : true,
  AUTOLIKE_EMOJI: process.env.AUTOLIKE_EMOJI || '❤️,🩷,🧡,💛,💚,💙,🤍,🩶,🖤,🤎,💜,🩵', // For liking status updates(stories)
  AUTO_REPLY_STATUS: process.env.AUTO_REPLY_STATUS !== undefined ? process.env.AUTO_REPLY_STATUS === 'false' : false,
  STATUS_READ_MSG: process.env.STATUS_READ_MSG || 'Status Viewed by joel-Md',
  VOICE_CHAT_BOT: process.env.VOICE_CHAT_BOT !== undefined ? process.env.VOICE_CHAT_BOT === 'false' : false,
  AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT !== undefined ? process.env.AUTO_STATUS_REACT === 'true' : true,
  ANTILINK: process.env.ANTILINK !== undefined ? process.env.ANTILINK === 'false' : false,
  ANTI_LEFT: process.env.ANTI_LEFT !== undefined ? process.env.ANTI_LEFT === 'false' : true,
  AUTO_STICKER: process.env.AUTO_STICKER !== undefined ? process.env.AUTO_STICKER === 'false' : false,
  AUTO_READ: process.env.AUTO_READ !== undefined ? process.env.AUTO_READ === 'false' : false,
  AUTO_TYPING: process.env.AUTO_TYPING !== undefined ? process.env.AUTO_TYPING === 'true' : false,
  AUTO_RECORDING: process.env.AUTO_RECORDING !== undefined ? process.env.AUTO_RECORDING === 'false' : false,
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE !== undefined ? process.env.ALWAYS_ONLINE === 'true' : false,
  AUTO_REACT: process.env.AUTO_REACT !== undefined ? process.env.AUTO_REACT === 'false' : false,
   /*auto block only for 212 */
  AUTO_BLOCK: process.env.AUTO_BLOCK !== undefined ? process.env.AUTO_BLOCK === 'false' : true,
  /*joel james tech added anti delete cmd*/
  ANTI_DELETE: process.env.ANTI_DELETE !== undefined ? process.env.ANTI_DELETE === 'true' : false,
  /*lets add auto bot respond*/
  CHAT_BOT: process.env.CHAT_BOT !== undefined ? process.env.CHAT_BOT === 'false' : false,
  /*lets add chat bot mode*/
  CHAT_BOT_MODE: process.env.CHAT_BOT_MODE || "public",
  /*how about Lydia chat bot*/
  LYDEA: process.env.LYDEA !== undefined ? process.env.LYDEA === 'true' : false,
  REJECT_CALL: process.env.REJECT_CALL !== undefined ? process.env.REJECT_CALL === 'false' : false, 
  NOT_ALLOW: process.env.NOT_ALLOW !== undefined ? process.env.NOT_ALLOW === 'false' : true,
  MODE: process.env.MODE || "public",
  DELETED_MESSAGES_CHAT_ID: process.env.DELETED_MESSAGES_CHAT_ID || "94756539252@s.whatsapp.net",
  OWNER_NAME: process.env.OWNER_NAME || "joeljamesXtech",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "94756539252",
  SUDO_NUMBER: process.env.SUDO_NUMBER || "94756539252",
  GEMINI_KEY: process.env.GEMINI_KEY || "AIzaSyCUPaxfIdZawsKZKqCqJcC-GWiQPCXKTDc",
  WELCOME: process.env.WELCOME !== undefined ? process.env.WELCOME === 'false' : false, 
};


module.exports = config;

  
