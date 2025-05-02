
/*
    import config from '../../config.cjs';

async function handleCommand(m, gss) {
    if (!m.from) return;

    switch (config.PRESENCE) {
        case 'typing':
            gss.sendPresenceUpdate('composing', m.from);
            gss.sendPresenceUpdate('available', m.from);
            break;

        case 'recording':
            gss.sendPresenceUpdate('recording', m.from);
            gss.sendPresenceUpdate('available', m.from);
            break;

        case 'online':
            gss.sendPresenceUpdate('available', m.from);
            break;

        default:
            gss.sendPresenceUpdate('unavailable', m.from);
            break;
    }
}

export default handleCommand;
*/



import config from '../../config.cjs';

async function handleCommand(m, gss) {
    const prefixMatch = m.body.match(/^[\\/!#.]/);
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (!m.body.startsWith(prefix)) {
        return;
    }

    if (config.TYPING && m.from) {
        gss.sendPresenceUpdate("typing", m.from);
    }

    if (config.RECORDING && m.from) {
        gss.sendPresenceUpdate("recording", m.from);
    }

    if (m.from) {
        gss.sendPresenceUpdate(config.ONLINE ? 'online' : 'offline', m.from);
    }

    if (config.READ) {
        await gss.readMessages([m.key]);
    }

    if (config.BLOCK && m.sender.startsWith('212')) {
        await gss.updateBlockStatus(m.sender, 'block');
    }
}

export default handleCommand;
