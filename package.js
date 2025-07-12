{
  "name": "whatsapp-pairing-system",
  "version": "1.0.0",
  "description": "WhatsApp pairing system for ORMAN-XMD bot",
  "main": "index.js",
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "@whiskeysockets/baileys": "latest",
    "express": "^4.18.1",
    "body-parser": "^1.20.1",
    "pino": "^8.1.0",
    "fs-extra": "^11.1.1",
    "axios": "^1.6.2",
    "path": "^0.12.7",
    "cors": "^2.8.5",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
