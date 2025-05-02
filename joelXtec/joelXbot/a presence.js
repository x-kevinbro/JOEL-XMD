
    import config from '../../config.cjs';

async function handleCommand(m, gss) {
    if (!m.from) return;

    switch (config.WAPRESENCE {
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
