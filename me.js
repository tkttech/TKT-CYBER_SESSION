const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

// Environment setup
require('dotenv').config();
const PORT = process.env.PORT || 8000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const pairRouter = require('./pair');
app.use('/code', pairRouter);

// HTML routes
app.get('/pair', (req, res) => {
  res.sendFile(path.join(__dirname, 'pair.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Increase event listeners limit
require('events').EventEmitter.defaultMaxListeners = 100;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Pairing endpoint: http://localhost:${PORT}/pair`);
});

module.exports = app;
