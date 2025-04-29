import config from '../../config.js'; // adjust path as needed

const antilinkSettings = {}; // Store per-group antilink status

export const handleAntilink = async (m, sock, logger, isBotAdmins, isAdmins, isCreator) => {
    const PREFIX = /^[\\/!#.]/;
    const isCOMMAND = (body) => PREFIX.test(body);
    const prefixMatch = isCOMMAND(m.body) ? m.body.match(PREFIX) : null;
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    // Initialize group setting
    if (!antilinkSettings[m.from]) {
        antilinkSettings[m.from] = { antilink: !!config.ANTILINK };

        // Optional: Notify group if auto-enabled
        if (config.ANTILINK && m.isGroup && isBotAdmins) {
            await sock.sendMessage(m.from, { text: '⚠️ *Antilink is enabled by default in this group.*' });
        }
    }

    // ─── Antilink Command ───────────────────────────────
    if (cmd === 'dlink') {
        if (!m.isGroup) {
            return await sock.sendMessage(m.from, { text: 'This command can only be used in groups.' }, { quoted: m });
        }

        if (!isBotAdmins) {
            return await sock.sendMessage(m.from, { text: 'The bot needs to be an admin to enable antilink.' }, { quoted: m });
        }

        if (!isAdmins) {
            return await sock.sendMessage(m.from, { text: 'Only group admins can use this command.' }, { quoted: m });
        }

        const args = m.body.slice(prefix.length + cmd.length).trim().split(/\s+/);
        const action = args[0] ? args[0].toLowerCase() : '';

        if (action === 'on') {
            antilinkSettings[m.from].antilink = true;
            return await sock.sendMessage(m.from, { text: '✅ *Antilink enabled!*' }, { quoted: m });
        }

        if (action === 'off') {
            antilinkSettings[m.from].antilink = false;
            return await sock.sendMessage(m.from, { text: '❌ *Antilink disabled!*' }, { quoted: m });
        }

        return await sock.sendMessage(m.from, {
            text: `📌 *Usage:*\n- ${prefix}antilink on\n- ${prefix}antilink off`
        }, { quoted: m });
    }

    // ─── Delete External Links ──────────────────────────
    if (antilinkSettings[m.from].antilink && m.body.match(/https?:\/\/[^\s]+/)) {
        if (!isBotAdmins) return;

        const gclink = `https://chat.whatsapp.com/${await sock.groupInviteCode(m.from)}`;
        const isLinkThisGc = new RegExp(gclink, 'i').test(m.body);

        if (isLinkThisGc) return; // Allow own group link
        if (isAdmins || isCreator) return; // Allow admins/owner

        await sock.sendMessage(m.from, { delete: m.key }); // Delete message

        // Optional warning
        await sock.sendMessage(m.from, { text: '⚠️ *External links are not allowed in this group.*' }, { quoted: m });
    }
};
