# Node JS Curriculum Template

This application follows the curriculum starting with the intermediate express lessons which I can use for the homework at the end of units. I've left some of the code in as placeholders and for my own notes.

# Table of Contents

- [Node JS Curriculum Template](#node-js-curriculum-template)
- [Table of Contents](#table-of-contents)
  - [I. Steps taken to create this project](#i-steps-taken-to-create-this-project)
    - [**1. Ubuntu/WSL exclusive**](#1-ubuntuwsl-exclusive)
      - [**(a)** View of VSC BEFORE running `code .` in the WSL terminal:](#a-view-of-vsc-before-running-code--in-the-wsl-terminal)
      - [**(b)** View of VSC AFTER running `code .` in the WSL terminal:](#b-view-of-vsc-after-running-code--in-the-wsl-terminal)
    - [**2. Initialize Node.js**](#2-initialize-nodejs)
    - [**3. Dependencies or installation commands I used while working on this project**](#3-dependencies-or-installation-commands-i-used-while-working-on-this-project)
    - [4. `app.js` and `server.js` architecture](#4-appjs-and-serverjs-architecture)
    - [5. Implement Routes and Utilities in `app.js`:](#5-implement-routes-and-utilities-in-appjs)
    - [6. How `.gitignore` is configured:](#6-how-gitignore-is-configured)
    - [7. Unit Test Related](#7-unit-test-related)
      - [question on how testing works](#question-on-how-testing-works)
    - [8. Run Your Server:](#8-run-your-server)
  - [II. Installation](#ii-installation)
  - [III. Usage](#iii-usage)
    - [Starting the server](#starting-the-server)
    - [Run your tests](#run-your-tests)
  - [IV. Environment Variables \& Setup](#iv-environment-variables--setup)
  - [V. Database Configuration](#v-database-configuration)
  - [VI. Commands and Scripts you MUST know](#vi-commands-and-scripts-you-must-know)
    - [`npm run test`](#npm-run-test)
      - [What it does:](#what-it-does)
      - [When to use it:](#when-to-use-it)
      - [How it works:](#how-it-works)
        - [1. Environment Variable Setting](#1-environment-variable-setting)
        - [2. Conditional Database URI Selection](#2-conditional-database-uri-selection)
        - [3. Database Connection](#3-database-connection)
        - [4. Test Execution](#4-test-execution)
      - [Why it's helpful](#why-its-helpful)
        - [1. Isolation](#1-isolation)
        - [2. Consistency](#2-consistency)
        - [3. Performance](#3-performance)
        - [4. Safety](#4-safety)
        - [5. Environment-specific Configuration](#5-environment-specific-configuration)
        - [6. Dependency Mocking](#6-dependency-mocking)
        - [7. Continuous Integration (CI) Compatibility](#7-continuous-integration-ci-compatibility)
    - [`npm start`](#npm-start)
    - [`npm run debug`](#npm-run-debug)
    - [`npm run dev`](#npm-run-dev)
    - [`npm run dev:test`](#npm-run-devtest)

## I. Steps taken to create this project

### **1. Ubuntu/WSL exclusive**

I found that in order to use Node JS in my Ubuntu environment I had to (i) create the project folder locally, (ii) open that folder in VS Code, (iii) open the WSL terminal and (iv) run the command `code .` which would open the same project in a new VSC window with a different terminal and WSL display.  Below are the **before** and **after** screenshots in that order.  *NB* I found that I was able to troubleshoot more easily after going through this process over and over as opposed to just using the terminal shown in the **before** screenshot.

#### **(a)** View of VSC BEFORE running `code .` in the WSL terminal:

![Before](src/assets/images/VSC%20screenshot_before.png)

#### **(b)** View of VSC AFTER running `code .` in the WSL terminal:

![After](src/assets/images/VSC%20screenshot_after.png)

[Back to TOC](#table-of-contents)

### **2. Initialize Node.js**

Run `npm init -y` to create a `package.json` file with default values.

[Back to TOC](#table-of-contents)

### **3. Dependencies or installation commands I used while working on this project**

In the same directory, run `npm install express` to install Express and add it to your project's dependencies.

In the same directory, run `npm install --save-dev nodemon` to install Nodemon and add it to your project's dependencies but not globally.

In the same directory, run `npm install --save-dev supertest` to install Supertest and add it to your project's dependencies but not globally.

In the same directory, run `npm install --save-dev jest` to install Jest and add it to your project's dependencies but not globally.

[Back to TOC](#table-of-contents)

### 4. `app.js` and `server.js` architecture

`app.js`:

```
const express = require('express');
const app = express();

module.exports = app;
```

`server.js`:

```
const app = require('./app');

app.listen(3000, function () {
    console.log("Server started on port 3000.")
});
```

### 5. Implement Routes and Utilities in `app.js`:

[Back to TOC](#table-of-contents)

`app.js`:

- First, parse incoming request bodies as JSON by adding: `app.use(express.json());`

- Second, use the logger middleware to log all incoming requests
  by adding: `app.use(middleware.logger);`

- Third, define your routes, including any that use checkForPassword for authentication:

```
app.use('/items', itemRoutes);
app.use('/users', userRoutes);
```

- Fourth, list all your routes here, including a welcome route:

```
app.get('/', (req, res) => {
    res.send('Welcome to the Express Shopping List!');
});

app.get('/secret', middleware.checkForPassword, (req, res, next) => {
    return res.send("I LOVE HOUNDS!!!")
})

app.get('/private', middleware.checkForPassword, (req, res, next) => {
    return res.send("You have reached the private page!")
})
```

- Fifth, place your 404 error handler after all other routes and it will catch any unmatched requests and create a corresponding ExpressError:

```
app.use((req, res, next) => {
    const e = new ExpressError('Page Not Found', 404);
    next(e)
});
```

- Sixth, place your general error handler after the 404 error handler and all other routes so that it will catch and respond to any errors thrown in the application, including those from checkForPassword and the 404 handler:

```
app.use((err, req, res, next) => {
    let status = err.status || 500; //500 means "Internal Server Error"
    let message = err.message;

    return res.status(status).json({
        error: { message, status }
    });
});
```

- Finally, after following these steps your `app.js` should look like this:

```
const express = require('express');
const app = express();
const ExpressError = require('./utils/expressError');
const middleware = require('./utils/middleware');

const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

app.use(middleware.logger);

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
    const e = new ExpressError('Page Not Found', 404);
    next(e)
});

app.use((err, req, res, next) => {
    let status = err.status || 500; //500 means "Internal Server Error"
    let message = err.message;

    return res.status(status).json({
        error: { message, status }
    });
});

module.exports = app;
```

### 6. How `.gitignore` is configured:

In this project, the `.gitignore` file is used to specify intentionally untracked files that Git should ignore. Files already tracked by Git are not affected. The configuration helps in keeping the repository clean by excluding files that are not necessary to be shared with others or that can be generated from the source code. Here's how it's set up:

-**(a)** `node_modules/`: This directory contains all the packages and their dependencies installed via npm. Since these dependencies can be installed by running `npm install`, there's no need to include them in the repository. Ignoring this folder reduces the size of the project and avoids potential conflicts between different developers' environments.

-**(b)** `.env`: Environment variables are crucial for configuring the application in different environments (development, testing, production, etc.). They often contain sensitive information, such as database passwords or API keys, that should not be shared publicly. By ignoring the `.env` file, we ensure that these details are kept secure and must be set up individually by each developer.

Including these two entries in the `.gitignore` file ensures that our repository remains clean and secure. It's a best practice to update this file as the project evolves and new files or directories need to be excluded from version control.

[Back to TOC](#table-of-contents)

### 7. Unit Test Related

#### question on how testing works

my question: how is the mockItems array helping in testing the route? If we're mocking the item.js module and using the findAll method on the mockItems array then what is truly being tested? If we subsitute the retrieval of the items array from fakeDb for a mockItems array then how is this test testing if this route is retrieving data in a realistic scenario?

answer: The mockItems array in the test serves several purposes:

1. Isolation: By using mockItems, the test isolates the route handling from the actual data access layer. This means the test isn't dependent on the state of an external database or data structure, making the test more reliable and faster to execute.

2. Predictability: It ensures that the data being tested against is predictable and controlled. This is crucial for testing because it means you know exactly what data you're working with, which helps in asserting the expected outcomes without surprises from changing data states.

3. Focus on Route Logic: The primary goal of such a test is to verify that the route correctly handles requests and responses as expected, not to test the underlying data access layer or database integration. By mocking the data retrieval, the test focuses on the route's ability to process and respond with the correct data format and HTTP status codes.

However, your concern about realism in testing is valid. Mocking the Item.findAll method with a static mockItems array means you're not testing the integration between the route and the actual data retrieval logic from the fakeDb or any other database. This approach tests the route's logic in isolation but doesn't ensure that the route works correctly in a real-world scenario where data comes from a dynamic source.

To address this and add more realism to your tests, you could:

1. Integration Tests: Write separate integration tests that interact with the actual fakeDb or a test database. These tests would verify that the route correctly retrieves and manipulates data in a more realistic scenario.

2. End-to-End Tests: Implement end-to-end tests that simulate real user interactions from the front end through the back end to the database and back. This would test the entire stack, including the route, in a real-world scenario.

3. Hybrid Approach: Use mocking for unit tests to ensure route logic is correct while relying on integration and end-to-end tests for testing the interaction with the database and the overall application flow.

In summary, while mocking with mockItems is beneficial for isolating and focusing on testing the route's logic, it's also important to complement these tests with integration and end-to-end tests to ensure the application works as expected in real-world scenarios.

[Back to TOC](#table-of-contents)

### 8. Run Your Server:

- Navigate to your src directory in the terminal.
- Run `node server.js` to start your server.

This guide sets up a basic Express project structure. You can expand it by adding more routes, utilities, and tests as needed.

[Back to TOC](#table-of-contents)

## II. Installation

1. Clone the repository: `git clone https://github.com/ahauser16/express-shopping-list.git`
2. Navigate to the project directory: `cd express-shopping-list`
3. Install the dependencies: `npm install`

[Back to TOC](#table-of-contents)

## III. Usage

### Starting the server

1. Navigate into the `src` folder and start the server by running the command: `node server.js`
2. Open your browser and navigate to `http://localhost:3000`
3. To perform an operation,

[Back to TOC](#table-of-contents)

### Run your tests

1. Make sure the server isn't running by executing the command `ctrl + z` in the terminal.
2. Navigate into the `src` folder.
3. Run the command `npm test`

[Back to TOC](#table-of-contents)

## IV. Environment Variables & Setup

To ensure that your application connects to the correct database, you need to set up environment variables. This application uses two databases: one for development and another for testing. Follow these steps to set up your environment variables:

1. `.env` File: Your environment variables are stored in the `.env` file at the root of your project. This file includes variables for the development and test databases, as well as the environment mode (`NODE_ENV`). Here's how it's set up:

   ```
   NODE_ENV=development
   DB_URI=postgresql:///your_database_name
   TEST_DB_URI=postgresql:///your_test_database_name
   ```

2. Ignoring `.env` in Version Control: The `.gitignore` file includes `.env` to ensure that your environment variables are not committed to your version control system, keeping sensitive information secure.

```
node_modules/
.env
```

## V. Database Configuration

1. `db.js`: This file configures the database connection using the `pg` library. It selects the correct database URI based on the `NODE_ENV` variable. This setup allows you to switch between your development and test databases seamlessly.

```
const { Client } = require("pg");
const DB_URI = process.env.NODE_ENV === "test" ? process.env.TEST_DB_URI : process.env.DB_URI;

const db = new Client({
    connectionString: DB_URI
});

db.connect(err => {
    if (err) {
        console.error("Connection error", err.stack);
    } else {
        console.log("Connected to database:", DB_URI);
    }
});

module.exports = db;
```

## VI. Commands and Scripts you MUST know

This project includes several npm scripts to facilitate development, testing, and debugging. Below are the instructions for using these scripts:

### `npm run test`

#### What it does:
Sets the `NODE_ENV` environment variable to `test` and runs tests using Jest. This ensures that your application connects to the test database.

#### When to use it: 
Run this command when you want to execute your test suite. It's especially useful to ensure that all tests pass before pushing changes to your version control system.

#### How it works:

##### 1. Environment Variable Setting

The `npm run test` command in the `package.json` file is configured to set the `NODE_ENV` environment variable to `test` before running the tests with Jest.  Keep in mind that this command explicitly sets `NODE_ENV` to `test`, which is crucial for the next step.

```
"test": "NODE_ENV=test jest"
```

##### 2. Conditional Database URI Selection

In the `db.js` file, the database URI is selected based on the value of `NODE_ENV`. If `NODE_ENV` is set to `test`, it uses `process.env.TEST_DB_URI;` otherwise, it defaults to `process.env.DB_URI` for development or production environments:

```
const DB_URI = process.env.NODE_ENV === "test" ? process.env.TEST_DB_URI : process.env.DB_URI;
```

This means that when NODE_ENV is test, the connection string for the test database is used.

##### 3. Database Connection
With the correct `DB_URI` selected, the `db` object is configured to connect to the specified database. This ensures that all database operations performed during the tests are executed against the test database, isolating test data from development or production data.

##### 4. Test Execution
With the environment correctly set up and the application connected to the test database, Jest runs the test suite. This setup ensures that your tests interact with the intended test database, providing a consistent and isolated environment for accurate testing.

#### Why it's helpful 
Running tests on a test database while the `NODE_ENV` environment variable is set to `test` offers several benefits:

##### 1. Isolation
It ensures that the tests do not interfere with production data or the development database, maintaining data integrity and preventing accidental data loss or corruption.

##### 2. Consistency
By using a dedicated test database, you can ensure that the tests start with a known database state, which is crucial for repeatability and reliability of test results.

##### 3. Performance
Test databases can be optimized for speed, allowing for faster test execution. This is because they can be smaller and not carry the overhead of production-level data and logging.

##### 4. Safety
It prevents accidental execution of potentially destructive operations on the production database, such as deletions or updates.

##### 5. Environment-specific Configuration
Setting `NODE_ENV` to `test` allows for custom configuration (like database connection strings, logging levels, or third-party service mocks) that are specific to the testing environment, ensuring that tests run under conditions similar to production but without the risk.

##### 6. Dependency Mocking
In a test environment, it's easier to mock external services and integrations, ensuring that the tests are not dependent on external factors and are more focused on the application logic itself.

##### 7. Continuous Integration (CI) Compatibility
Using a test database and environment makes it easier to integrate with CI/CD pipelines, ensuring that automated tests can run in an isolated and controlled environment before any code is deployed to production.



### `npm start`

- **What it does:** Starts the server normally for production or general development use.
- **When to use it:** Use this command to start your application in a production environment or when you're not actively developing and just want to run the application.

### `npm run debug`

- **What it does:** Sets the `NODE_ENV` environment variable to `development` and starts the server with the `nodemon` tool in debug mode (`--inspect`). This allows you to attach a debugger to the running process for more in-depth troubleshooting.
- **When to use it:** This command is useful when you need to debug your application and want to use a debugger to step through your code.

### `npm run dev`

- **What it does:** Sets the `NODE_ENV` environment variable to `development` and uses `nodemon` for automatic server restarts during development. This means that the server will automatically restart whenever you save changes to your files.
- **When to use it:** Use this command during development for a smoother workflow. It saves you from having to manually restart the server each time you make changes to your code.

### `npm run dev:test`

- **What it does:** Similar to `npm run test`, it sets the `NODE_ENV` environment variable to `test` but uses `nodemon` to automatically restart the test suite on file changes.
- **When to use it:** This command is particularly useful during test-driven development (TDD) or when you are actively working on fixing tests. It provides immediate feedback by re-running tests as soon as you save changes.