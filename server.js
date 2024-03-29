const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
// Load env vars
dotenv.config({ path: './config/config.env' });

connectDB();

// Middlewares
app.use(express.json({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

// Routes

if (process.env.NODE_ENV === 'development') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // relative path
  });
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // relative path
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server Running on port: ${port}`));
