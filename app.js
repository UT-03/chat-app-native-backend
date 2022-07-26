require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const AuthRoutes = require('./routes/Auth');
const UserRoutes = require('./routes/User');
const { addSockets } = require('./sockets');

// Initializing express app
const app = express();

// Handling cors errors
app.use(cors());

// Extracting json data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes here
app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);

// Handling error
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'Something went wrong, please try again later.' });
});

// Connecting to database
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        // Starting server
        return app.listen(process.env.PORT);
    })
    .then(server => {
        // Adding socket.io
        addSockets(server)

        // consoling result
        console.log('Connected to database and server started at port ', process.env.PORT);
    })
    .catch(err => {
        console.log(err);
    });