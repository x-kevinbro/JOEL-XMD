const gay = async (message, sock) => {
    const text = message.body?.trim().toLowerCase();

    // Trigger only if exact message is "gay"
    if (text !== "gay") return;

    const chatId = message.key.remoteJid;
    const allowedGroup = "918413038488-1627828736@g.us";

    if (chatId !== allowedGroup) {
        return message.reply("*This command can only be used in the authorized group.*");
    }

    // Get the mentioned user or fallback to sender
    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const target = mentioned || message.key.participant || message.key.remoteJid;
    const username = target?.split("@")[0];

    // List of certified non-gay numbers
    const nonGayNumbers = [
        "255714595078",
        "25767570963",
        "255781144539",
        "919863584303"
    ];

    const isNonGay = nonGayNumbers.includes(username);
    const percentage = isNonGay ? 0 : Math.floor(Math.random() * 101);
    const badge = isNonGay ? "✅ *Certified Hetero*" : "";

    // Gay Leader info
    const gayLeaderName = "Awma";
    const gayLeaderNumber = "+91 84140 77624";

    const replyText = `🏳️‍🌈 *Gay Scanner Activated*\n\n` +
        `👤 *Target:* @${username}\n` +
        `🌈 *Gay Level:* *${percentage}%*\n${badge ? badge + "\n" : ""}` +
        `👑 *Gay Leader:* ${gayLeaderName} (${gayLeaderNumber})\n\n` +
        `_Scanned using the legendary JOEL XMD Bot_`;

    await sock.sendMessage(chatId, {
        text: replyText,
        mentions: [target]
    }, { quoted: message });
};

export default gay;
