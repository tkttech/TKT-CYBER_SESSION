require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs-extra');
const logger = require('pino')({ level: process.env.LOG_LEVEL || 'info' });

// Initialize Express app
const app = express();

// Configuration
const PORT = process.env.PORT || 10000; // Render uses 10000 by default
const SESSION_DIR = path.join(__dirname, 'session');

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure session directory exists
fs.ensureDirSync(SESSION_DIR);

// Routes
const pairRouter = require('./pair');
app.use('/code', pairRouter);

// HTML routes
app.get('/pair', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'pair.html'));
  } catch (error) {
    logger.error(`Error serving pair page: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'main.html'));
  } catch (error) {
    logger.error(`Error serving main page: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.stack}`);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.fatal(`Uncaught Exception: ${err.stack}`);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

module.exports = app;
