const express = require('express');
const router = express.Router();
const { makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const { toBuffer } = require("qrcode");
const pino = require("pino");

const MESSAGE = process.env.MESSAGE || `
*ORMAN-XMD BOT SESSION CONNECTED SUCCESSFULLY* ✅
`;

router.get('/', async (req, res) => {
    try {
        // Use in-memory auth state
        const { state, saveCreds } = useSingleFileAuthState(null);
        
        const socket = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: "silent" }),
            browser: ["Chrome (Linux)", "", ""]
        });

        socket.ev.on('creds.update', saveCreds);

        socket.ev.on("connection.update", async (update) => {
            const { qr, connection } = update;
            
            if (qr) {
                try {
                    const qrBuffer = await toBuffer(qr);
                    res.setHeader('Content-Type', 'image/png');
                    res.end(qrBuffer);
                } catch (error) {
                    console.error("QR generation error:", error);
                    res.status(500).send("QR generation failed");
                }
            }
            
            if (connection === "open") {
                await socket.sendMessage(socket.user.id, { text: '𝙾𝚁𝙼𝙰𝙽~𝚇𝙼𝙳~' + MESSAGE });
            }
        });

    } catch (err) {
        console.error("QR error:", err);
        res.status(500).send("QR generation failed");
    }
});

module.exports = router;
