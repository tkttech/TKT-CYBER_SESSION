const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8000;

// Improved session management without auth_info_baileys
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: { secure: false, maxAge: 60000 }
}));

// Routes
const qrRouter = require('./qr');
const pairRouter = require('./pair');

app.use('/qr', qrRouter);
app.use('/code', pairRouter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes for HTML pages
app.get('/pair', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pair.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
