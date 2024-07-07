// src/utils/middleware.js
const ExpressError = require('./expressError');

function logger(req, res, next) {
    console.log(`RECEIVED a ${req.method} request to ${req.path}`);
    return next();
}

function checkForPassword(req, res, next) {
    try {
        if (req.query.password !== 'abc123') {
            throw new ExpressError('Invalid password', 402);
        } else {
            //notice nothing is passed to `next()` so the request stops here and if there is no error then it moves on to the next request which is the route handler.  
            return next();
        }
    } catch (err) {
        return next(err);
    }
}

module.exports = { logger, checkForPassword };