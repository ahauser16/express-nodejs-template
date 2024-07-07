# notes on `app.js`

## The interaction between `middleware.js`, `expressError.js`, and `app.js`

1. **ExpressError Class**: Defined in `src/utils/expressError.js`, the `ExpressError` class extends the built-in `Error` class, allowing you to create error objects with a custom message and status code. This is particularly useful for generating meaningful error responses in your application.

2. **Middleware Functions**: In `src/utils/middleware.js`, you have defined two middleware functions, `logger` and `checkForPassword`. The `logger` function logs each incoming request, which is helpful for debugging and monitoring. The `checkForPassword` function checks if the correct password is provided in the query string; if not, it throws an `ExpressError` with a 403 status code, indicating a forbidden access.

3. **App.js Integration**:

- Logger: To ensure that every request is logged, you should place app.use(middleware.logger); right after app.use(express.json()); in your app.js file. This ensures that the logger middleware runs for every request immediately after it's parsed as JSON.
- Error Handling: Your general error handler middleware at the end of app.js catches any errors thrown in the application, including those thrown by checkForPassword. It uses the status and message properties of the ExpressError object to send a structured error response. This middleware should always be placed last to catch any unhandled errors.
- 404 Error Handler: Before the general error handler, you have a middleware for handling 404 errors. This catches any requests that don't match your defined routes. It creates an ExpressError with a 404 status and passes it to the next error handler.

4. **Correct Sequence**:

- First, parse incoming request bodies as JSON with express.json().
- Use the logger middleware to log all incoming requests.
- Define your routes, including any that use checkForPassword for authentication.
- After all routes, add the 404 error handler to catch any unmatched requests and create a corresponding ExpressError.
- Finally, place the general error handler to catch and respond to any errors thrown in the application, including those from checkForPassword and the 404 handler.

By organizing your middleware and error handlers in this sequence, you ensure that requests are logged, authentication is enforced where necessary, and errors are handled gracefully, providing informative responses to the client.
