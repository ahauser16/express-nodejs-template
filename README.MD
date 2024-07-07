# Express Shopping List

This is a simple calculator application built using Express.js. It allows users to perform basic mathematical operations such as addition, subtraction, multiplication, and division.

# Table of Contents

- [Express Shopping List](#express-shopping-list)
- [Table of Contents](#table-of-contents)
  - [I. Exercise Instructions](#i-exercise-instructions)
    - [**Further Study**](#further-study)
  - [II. Steps taken to create this project](#ii-steps-taken-to-create-this-project)
    - [1. Ubuntu/WSL exclusive:](#1-ubuntuwsl-exclusive)
      - [View of VSC BEFORE running `code .` in the WSL terminal:](#view-of-vsc-before-running-code--in-the-wsl-terminal)
      - [View of VSC AFTER running `code .` in the WSL terminal:](#view-of-vsc-after-running-code--in-the-wsl-terminal)
    - [2. Initialize Node.js](#2-initialize-nodejs)
    - [3. Install Express and Nodemon:](#3-install-express-and-nodemon)
    - [4. Set Up `app.js` and `server.js`:](#4-set-up-appjs-and-serverjs)
    - [5. Implement Routes and Utilities in `app.js`:](#5-implement-routes-and-utilities-in-appjs)
    - [6. Create and update `.gitignore`:](#6-create-and-update-gitignore)
    - [7. Write unit tests:](#7-write-unit-tests)
      - [Common HTTP status codes](#common-http-status-codes)
    - [8. Run Your Server:](#8-run-your-server)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Starting the server](#starting-the-server)
    - [Run your tests](#run-your-tests)
  - [Notes from solution:](#notes-from-solution)
    - [Error Handling](#error-handling)

## I. Exercise Instructions

For this exercise we will be building a simple JSON API application where we will store a shopping list. You should use an **array** to store your items in the shopping list.

Each item should be a JavaScript object with the keys of name, and price.

Remember that since you are using an **array** for storage, this will be cleared each time the server restarts. Create a simple file called **_fakeDb.js_** which contains the following:

```
global.items = []

module.exports = items
```

Use this list of **_items_** in your routes and test files.

Your application should have the following routes:

1. **_GET /items_** - this should render a list of shopping items.

Here is what a response looks like:

**[{“name”: “popsicle”, “price”: 1.45}, {“name”:”cheerios”, “price”: 3.40}]**

1. **_POST /items_** - this route should accept JSON data and add it to the shopping list.

Here is what a sample request/response looks like:

**{“name”:”popsicle”, “price”: 1.45} => {“added”: {“name”: “popsicle”, “price”: 1.45}}**

1. **_GET /items/:name_** - this route should display a single item’s name and price.

Here is what a sample response looks like:

**{“name”: “popsicle”, “price”: 1.45}**

1. **_PATCH /items/:name_**, this route should modify a single item’s name and/or price.

Here is what a sample request/response looks like:

**{“name”:”new popsicle”, “price”: 2.45} => {“updated”: {“name”: “new popsicle”, “price”: 2.45}}**

1. **_DELETE /items/:name_** - this route should allow you to delete a specific item from the array.

Here is what a sample response looks like:

**{message: “Deleted”}**

Please make use of the Express Router.

Warning: STOP and make sure your routes are tested! Make sure you have tested all of these routes with Jest and Supertest.

### **Further Study**

1. Make your own data store! Read/Write to a JSON file instead of using an array for storage.
2. Use OOP to help refactor your logic for reading/writing. This is almost like building your own ORM!
3. Build a front-end that interacts with your API. This will involve figuring out how to load static assets with express. Try doing this in jQuery, or vanilla JavaScript (ultra challenge)!

[Back to TOC](#table-of-contents)

## II. Steps taken to create this project

### 1. Ubuntu/WSL exclusive:

I found that in order to use Node JS in my Ubuntu environment I had to create the project folder locally, open that folder in VS Code, open the WSL terminal and run the command `code .` which would open a new VSC window with a different terminal and WSL notation display (see below).

#### View of VSC BEFORE running `code .` in the WSL terminal:

![Before](src/assets/images/VSC%20screenshot_before.png)

#### View of VSC AFTER running `code .` in the WSL terminal:

![After](src/assets/images/VSC%20screenshot_after.png)

[Back to TOC](#table-of-contents)

### 2. Initialize Node.js

Run `npm init -y` to create a `package.json` file with default values.

[Back to TOC](#table-of-contents)

### 3. Install Express and Nodemon:

In the same directory, run `npm install express` to install Express and add it to your project's dependencies.

In the same directory, run `npm install --save-dev nodemon` to install Nodemon and add it to your project's dependencies but not globally.

In the same directory, run `npm install --save-dev supertest` to install Supertest and add it to your project's dependencies but not globally.

In the same directory, run `npm install --save-dev jest` to install Jest and add it to your project's dependencies but not globally.

[Back to TOC](#table-of-contents)

### 4. Set Up `app.js` and `server.js`:

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

### 6. Create and update `.gitignore`:

- Make sure to include `node_modules/` and any environment files (like `.env`) in your `.gitignore` file to avoid committing them to version control.

[Back to TOC](#table-of-contents)

### 7. Write unit tests:

Update your `package.json` to include a test script `"test": "jest"`.

Based on common and best practices, here's a list of tests you should consider for your `itemRoutes.js` file:

1. GET /items
   Test for a successful response (status code 200).
   Test that the response is an array.
   Test that the array contains objects with the expected properties (`name` and `price`).

2. POST /items
   Test for successful item creation (status code 201).
   Test for the response body to contain the added item object.
   Test for handling missing item data (e.g., missing `name` or `price`), expecting a 400 or similar error code.

3. GET /items/:name
   Test for a successful response (status code 200) with the correct item.
   Test for a response when the item does not exist (status code 404 or similar).

4. PATCH /items/:name
   Test for successful item update (status code 200).
   Test for the response body to contain the updated item object.
   Test for handling updates to non-existing items (status code 404 or similar).

5. DELETE /items/:name
   Test for successful item deletion (status code 200 or 204).
   Test for handling deletion of non-existing items (status code 404 or similar).

#### Common HTTP status codes

- `200 OK` - The request has succeeded.
- `201 Created` - The request has succeeded and a new resource has been created as a result.
- `202 Accepted` - The request has been received but not yet acted upon; it is non-committal.
- `204 No Content` - The server successfully processed the request, but is not returning any content.
- `400 Bad Request` - The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax).
- `401 Unauthorized` - The request has not been applied because it lacks valid authentication credentials for the target resource.
- `403 Forbidden` - The server understood the request but refuses to authorize it.
- `404 Not Found` - The server can't find the requested resource.
- `405 Method Not Allowed` - The request method is known by the server but has been disabled and cannot be used.
- `408 Request Timeout` - The server would like to shut down this unused connection.
- `500 Internal Server Error` - The server encountered an unexpected condition that prevented it from fulfilling the request.
- `501 Not Implemented` - The server does not support the functionality required to fulfill the request.
- `502 Bad Gateway` - The server, while acting as a gateway or proxy, received an invalid response from the upstream server.
- `503 Service Unavailable` - The server is not ready to handle the request, usually due to temporary overloading or maintenance.
- `504 Gateway Timeout` - The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server.

- NB --> my question: how is the mockItems array helping in testing the route? If we're mocking the item.js module and using the findAll method on the mockItems array then what is truly being tested? If we subsitute the retrieval of the items array from fakeDb for a mockItems array then how is this test testing if this route is retrieving data in a realistic scenario?

- answer: The mockItems array in the test serves several purposes:

1. Isolation: By using mockItems, the test isolates the route handling from the actual data access layer. This means the test isn't dependent on the state of an external database or data structure, making the test more reliable and faster to execute.

2. Predictability: It ensures that the data being tested against is predictable and controlled. This is crucial for testing because it means you know exactly what data you're working with, which helps in asserting the expected outcomes without surprises from changing data states.

3. Focus on Route Logic: The primary goal of such a test is to verify that the route correctly handles requests and responses as expected, not to test the underlying data access layer or database integration. By mocking the data retrieval, the test focuses on the route's ability to process and respond with the correct data format and HTTP status codes.

However, your concern about realism in testing is valid. Mocking the Item.findAll method with a static mockItems array means you're not testing the integration between the route and the actual data retrieval logic from the fakeDb or any other database. This approach tests the route's logic in isolation but doesn't ensure that the route works correctly in a real-world scenario where data comes from a dynamic source.

To address this and add more realism to your tests, you could:

- Integration Tests: Write separate integration tests that interact with the actual fakeDb or a test database. These tests would verify that the route correctly retrieves and manipulates data in a more realistic scenario.

- End-to-End Tests: Implement end-to-end tests that simulate real user interactions from the front end through the back end to the database and back. This would test the entire stack, including the route, in a real-world scenario.

- Hybrid Approach: Use mocking for unit tests to ensure route logic is correct while relying on integration and end-to-end tests for testing the interaction with the database and the overall application flow.

In summary, while mocking with mockItems is beneficial for isolating and focusing on testing the route's logic, it's also important to complement these tests with integration and end-to-end tests to ensure the application works as expected in real-world scenarios.

[Back to TOC](#table-of-contents)

### 8. Run Your Server:

- Navigate to your src directory in the terminal.
- Run `node server.js` to start your server.

This guide sets up a basic Express project structure. You can expand it by adding more routes, utilities, and tests as needed.

[Back to TOC](#table-of-contents)

## Installation

1. Clone the repository: `git clone https://github.com/ahauser16/express-shopping-list.git`
2. Navigate to the project directory: `cd express-shopping-list`
3. Install the dependencies: `npm install`

[Back to TOC](#table-of-contents)

## Usage

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

## Notes from solution:

```
items.test.js

process.env.NODE_ENV = "test";
// npm packages
const request = require("supertest");
// app imports
const app = require("../app");

let items = require("../fakeDb")

let item = { name: "silly", price:200 }

beforeEach(async () => {
  items.push(item)
});

afterEach(async () => {
  items = []
});
// end afterEach

/** GET /items - returns `{items: [item, ...]}` */

describe("GET /items", async function () {
  test("Gets a list of items", async function () {
    const response = await request(app).get(`/items`);
    const { items } = response.body;
    expect(response.statusCode).toBe(200);
    expect(items).toHaveLength(1);
  });
});
// end


/** GET /items/[name] - return data about one item: `{item: item}` */

describe("GET /items/:name", async function () {
  test("Gets a single item", async function () {
    const response = await request(app).get(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.item).toEqual(item);
  });

  test("Responds with 404 if can't find item", async function () {
    const response = await request(app).get(`/items/0`);
    expect(response.statusCode).toBe(404);
  });
});
// end


/** POST /items - create item from data; return `{item: item}` */

describe("POST /items", async function () {
  test("Creates a new item", async function () {
    const response = await request(app)
      .post(`/items`)
      .send({
        name: "Taco",
        price: 0
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.item).toHaveProperty("name");
    expect(response.body.item).toHaveProperty("price");
    expect(response.body.item.name).toEqual("Taco");
    expect(response.body.item.price).toEqual(0);
  });
});
// end


/** PATCH /items/[name] - update item; return `{item: item}` */

describe("PATCH /items/:name", async function () {
  test("Updates a single item", async function () {
    const response = await request(app)
      .patch(`/items/${item.name}`)
      .send({
        name: "Troll"
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.item).toEqual({
      name: "Troll"
    });
  });

  test("Responds with 404 if can't find item", async function () {
    const response = await request(app).patch(`/items/0`);
    expect(response.statusCode).toBe(404);
  });
});
// end


/** DELETE /items/[name] - delete item, 
 *  return `{message: "item deleted"}` */

describe("DELETE /items/:name", async function () {
  test("Deletes a single a item", async function () {
    const response = await request(app)
      .delete(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Deleted" });
  });
});
// end


```

### Error Handling


