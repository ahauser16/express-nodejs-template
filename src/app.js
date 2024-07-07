// src/app.js
const express = require('express');
const app = express();
const ExpressError = require('./utils/expressError');
const middleware = require('./utils/middleware');

const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

// app.use(middleware.logger);

app.use('/items', itemRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Express Shopping List!');
});

app.get('/secret', middleware.checkForPassword, (req, res, next) => {
    return res.send("I LOVE HOUNDS!!!")
})

app.get('/private', middleware.checkForPassword, (req, res, next) => {
    return res.send("You have reached the private page!")
})

app.use((req, res, next) => {
    return new ExpressError('Page Not Found', 404);
});

app.use((err, req, res, next) => {
    let status = err.status || 500; //500 means "Internal Server Error"
    let message = err.message;

    return res.status(status).json({
        error: { message, status }
    });
});

module.exports = app; 