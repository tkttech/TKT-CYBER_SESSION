{
  "name": "whatsapp-pairing-system",
  "version": "1.0.0",
  "description": "WhatsApp pairing system for ORMAN-XMD bot",
  "main": "index.js",
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=9.0.0"
  },
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "npm install",
    "test": "echo \"Error: no tests specified\" && exit 1"
  },
  "dependencies": {
    "@whiskeysockets/baileys": "6.5.0",
    "express": "4.18.2",
    "body-parser": "1.20.2",
    "pino": "8.16.0",
    "fs-extra": "11.2.0",
    "axios": "1.6.2",
    "path": "0.12.7",
    "cors": "2.8.5",
    "helmet": "7.1.0",
    "dotenv": "16.3.1"
  },
  "devDependencies": {
    "nodemon": "3.0.2"
  },
  "keywords": [
    "whatsapp",
    "bot",
    "pairing",
    "session"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/Orman87/SESSION-ID"
  },
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/Orman87/SESSION-ID/issues"
  }
  }
