const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

const app = express();

// DB connection
const connectToDb = require('./db/db');
connectToDb();

// Routes
const userRoutes = require('./routes/user.routes');

// ================= MIDDLEWARE =================

// Enable CORS
app.use(cors());

// Parse JSON body
app.use(express.json());

// Parse URL encoded data (optional but good)
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================

// Test route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// User routes
app.use('/users', userRoutes);

// ================= EXPORT =================
module.exports = app;