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
const cookieParser = require('cookie-parser');
// ================= MIDDLEWARE =================

// Enable CORS
app.use(cors());

// Parse JSON body
app.use(express.json());

// Parse URL encoded data (optional but good)
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
// ================= ROUTES =================

// Test route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// User routes
app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
module.exports = app;