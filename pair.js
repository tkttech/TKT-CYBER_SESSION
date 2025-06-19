const express = require('express');
const router = express.Router();
const { makeWASocket, useSingleFileAuthState, delay } = require("@whiskeysockets/baileys");
const pino = require("pino");

const MESSAGE = process.env.MESSAGE || `
*ORMAN-XMD BOT SESSION CONNECTED SUCCESSFULLY* ✅
`;

router.get('/', async (req, res) => {
    const { number } = req.query;
    
    if (!number) {
        return res.status(400).json({ error: 'Number is required' });
    }

    try {
        // Use in-memory auth state instead of file system
        const { state, saveCreds } = useSingleFileAuthState(null);
        
        const socket = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: "silent" }),
            browser: ["Chrome (Linux)", "", ""]
        });

        socket.ev.on('creds.update', saveCreds);

        if (!socket.authState.creds.registered) {
            await delay(1500);
            const cleanNumber = number.replace(/[^0-9]/g, '');
            const code = await socket.requestPairingCode(cleanNumber);
            return res.json({ code });
        }

        socket.ev.on("connection.update", (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === "open") {
                socket.sendMessage(socket.user.id, { text: '𝙾𝚁𝙼𝙰𝙽~𝚇𝙼𝙳~' + MESSAGE });
            }
            
            if (connection === "close") {
                const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                console.log(`Connection closed: ${reason}`);
            }
        });

    } catch (err) {
        console.error("Pairing error:", err);
        res.status(500).json({ error: 'Pairing failed' });
    }
});

module.exports = router;
