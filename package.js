{
  "name": "whatsapp-pairing-system",
  "version": "1.0.0",
  "description": "WhatsApp pairing system for ORMAN-XMD bot",
  "main": "index.js",
  "engines": {
    "npm": ">=9.7.2",
    "node": ">=20.0.0"
  },
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no tests specified\" && exit 1"
  },
  "dependencies": {
    "@whiskeysockets/baileys": "latest",
    "express": "^4.18.1",
    "body-parser": "^1.20.1",
    "pino": "^8.1.0",
    "fs-extra": "^11.1.1",
    "axios": "^1.6.2",
    "qrcode": "^1.5.3",
    "awesome-phonenumber": "^2.64.0",
    "phone": "3.1.30",
    "path": "^0.12.7",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
  }
