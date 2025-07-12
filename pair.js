const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
const pino = require("pino");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys");

// Configure logger
const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'error' : 'info' });

// Cleanup function
async function cleanupSession(sessionPath) {
    try {
        if (await fs.pathExists(sessionPath)) {
            await fs.remove(sessionPath);
            logger.info(`Cleaned up session at ${sessionPath}`);
        }
    } catch (error) {
        logger.error(`Error cleaning up session: ${error.message}`);
    }
}

// Version info
const version = [2, 3000, 1015901307];

router.get('/', async (req, res) => {
    let num = req.query.number;

    // Validate number
    if (!num || !/^\d+$/.test(num)) {
        return res.status(400).json({ 
            error: 'Invalid phone number',
            version 
        });
    }

    const sessionPath = './session';
    
    try {
        // Cleanup any existing session
        await cleanupSession(sessionPath);

        // Initialize WhatsApp connection
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        
        const sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger),
            },
            printQRInTerminal: false,
            logger: logger,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
        });

        if (!sock.authState.creds.registered) {
            await delay(1500);
            const code = await sock.requestPairingCode(num);
            
            if (!res.headersSent) {
                return res.json({ code, version });
            }
        }

        // Event handlers
        sock.ev.on('creds.update', saveCreds);
        
        sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === "open") {
                try {
                    await delay(10000);
                    
                    // Read session file
                    const sessionData = await fs.readFile(`${sessionPath}/creds.json`, 'utf-8');
                    
                    // Send session to user
                    await sock.sendMessage(sock.user.id, {
                        document: Buffer.from(sessionData),
                        mimetype: 'application/json',
                        fileName: 'creds.json'
                    });

                    // Send instructions
                    await sock.sendMessage(sock.user.id, {
                        text: `> 𖣔 *CREDS.JSON GENERATION SUCCESSFUL* 𖣔

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
> ✅ *STEP COMPLETED:* Pairing Process
> 🌌 *NEXT PHASE:* Deployment Sequence

> 📥 *ACTION REQUIRED:*
   ⇝ COPY ALL TEXTS IN THE CREDIT.JSON 
   ⇝ UPLOAD THE TEXTS TO AUTH_INFO_BAILEYS  
   ⇝ THEN START YOUR PANEL AND ENJOY THE BOT

🔧 *TECH SUPPORT:*
> ⌬ Developer: KING ORMAN
> ☎ Donations: https://tinyurl.com/yok3jqxk
> ⎔ Repo: https://github.com/Orman87/ORMAN_XMD

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
*[System ID: ORMAN-XMD bot-v${version.join('.')}]*`
                    });

                    // Cleanup session
                    await cleanupSession(sessionPath);
                } catch (error) {
                    logger.error(`Error in connection update: ${error.message}`);
                }
            }

            if (connection === "close" && lastDisconnect?.error) {
                logger.warn(`Connection closed: ${lastDisconnect.error.message}`);
                if (lastDisconnect.error.output?.statusCode !== 401) {
                    await delay(10000);
                    // Attempt to reconnect
                }
            }
        });
    } catch (error) {
        logger.error(`Pairing error: ${error.message}`);
        await cleanupSession(sessionPath);
        
        if (!res.headersSent) {
            return res.status(500).json({ 
                error: 'Service Unavailable',
                version 
            });
        }
    }
});

// Global error handling
process.on('uncaughtException', (error) => {
    const errorMessage = error.message || String(error);
    const ignorableErrors = [
        "conflict",
        "Socket connection timeout",
        "not-authorized",
        "rate-overlimit",
        "Connection Closed",
        "Timed Out",
        "Value not found"
    ];

    if (!ignorableErrors.some(e => errorMessage.includes(e))) {
        logger.fatal(`Uncaught Exception: ${error.stack}`);
    }
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

module.exports = router;
