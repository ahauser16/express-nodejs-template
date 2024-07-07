// src/utils/expressError.js
//The code below defines a custom error class named `ExpressError` that extends the built-in `Error` class in JavaScript.  

class ExpressError extends Error {
    //The `ExpressError` class has a constructor method that takes two parameters: `message` and `status`. The `message` parameter is intended to hold a descriptive error message, while the `status` parameter is meant to hold an HTTP status code that corresponds to the nature of the error (e.g., 404 for Not Found, 500 for Internal Server Error, etc.).
    constructor(message, status) {
        //Inside the constructor, the `super()` call is used to invoke the constructor of the parent `Error` class. This is necessary to ensure that the `ExpressError` instance is properly set up as an Error object, inheriting properties and methods from the `Error` class.
        super();
        //After calling `super()`, the constructor assigns the `message` and `status` parameters to the instance properties `this.message` and `this.status`, respectively. This allows instances of `ExpressError` to carry both a custom message and an HTTP status code, providing more detailed error information.
        this.message = message;
        this.status = status;
        //Lastly, the constructor uses `console.error(this.stack)` to log the error stack trace to the console. The `this.stack` property is inherited from the `Error` class and provides a stack trace that can be very helpful for debugging purposes, as it shows where the error was thrown in the code.
        console.error(this.stack);
    }
}

//By defining a custom error class like `ExpressError`, you can throw and handle errors in a more structured and informative way in Express.js applications, making it easier to debug issues and provide meaningful error responses to clients.

module.exports = ExpressError;