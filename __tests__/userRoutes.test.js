const request = require('supertest');
const app = require('../src/app');
const db = require('../src/fakeDb/db');

//create a new user before each test.  This way we can test the GET, POST, PATCH, and DELETE routes.  We can also test the GET /users/:id route.  We can also test the GET /users route.  
let testUser;
beforeEach(async () => {
    const result = await db.query(`INSERT INTO users (name, type) VALUES ('Peanut', 'admin') RETURNING  id, name, type`);
    testUser = result.rows[0]
})

//delete any data created by test.  This way we can test the DELETE /users/:id route.  
afterEach(async () => {
    await db.query(`DELETE FROM users`)
})

//close the database connection.  This way we can test the GET /users route.  
afterAll(async () => {
    await db.end()
})

//test the GET /users route.  This route should return a list of all users that was created by the beforeEach function which in this case is one user with a 200 status code.  
describe("GET /users", () => {
    test("Get a list with one user", async () => {
        const res = await request(app).get('/users')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ users: [testUser] })
    })
})

//test the GET /users/:id route.  This route should return a single user that was created by the beforeEach function which in this case is one user with a 200 status code if the id is valid and the user is found in the database table users.
describe("GET /users/:id", () => {
    test("Gets a single user", async () => {
        const res = await request(app).get(`/users/${testUser.id}`)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ user: testUser })
    })
    //test the GET /users/:id route.  This route should return a 404 status code if the id is invalid.  
    test("Responds with 404 for invalid id", async () => {
        const res = await request(app).get(`/users/0`)
        expect(res.statusCode).toBe(404);
    })
})

//test the POST /users route.  This route should create a new user and return the new user with a 201 status code if the user is created successfully.
describe("POST /users", () => {
    test("Creates a single user", async () => {
        const res = await request(app).post('/users').send({ name: 'BillyBob', type: 'staff' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            user: { id: expect.any(Number), name: 'BillyBob', type: 'staff' }
        })
    })
})

describe("PATCH /users/:id", () => {
    test("Updates a single user", async () => {
        const res = await request(app).patch(`/users/${testUser.id}`).send({ name: 'BillyBob', type: 'admin' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            user: { id: testUser.id, name: 'BillyBob', type: 'admin' }
        })
    })
    test("Responds with 404 for invalid id", async () => {
        const res = await request(app).patch(`/users/0`).send({ name: 'BillyBob', type: 'admin' });
        expect(res.statusCode).toBe(404);
    })
})

describe("DELETE /users/:id", () => {
    test("Deletes a single user", async () => {
        const res = await request(app).delete(`/users/${testUser.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ msg: 'DELETED!' })
    })
})


