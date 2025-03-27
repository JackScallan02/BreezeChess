const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Adjust the path to your server file
const db = require('../db'); // Your Knex instance

const { expect } = chai;

chai.use(chaiHttp);

describe('Users API', () => {
    before(async () => {
        // Run migrations and seed the database if necessary
        await db.migrate.latest();
        await db.seed.run();
    });

    after(async () => {
        // Clean up the database
        await db('users').truncate();
    });

    describe('GET /users', () => {
        it('should fetch all users with pagination and sorting', async () => {
            const res = await chai.request(server).get('/users').query({ limit: 5, offset: 0, sort_by: 'id', order: 'asc' });
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });

        it('should fetch a user by uid', async () => {
            const res = await chai.request(server).get('/users').query({ uid: 'test-uid' });
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.uid).to.equal('test-uid');
        });

        it('should return 200 if user is not found', async () => {
            const res = await chai.request(server).get('/users').query({ uid: 'nonexistent-uid' });
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('error', 'User not found');
        });
    });

    describe('GET /users/:id', () => {
        it('should fetch a user by ID', async () => {
            const res = await chai.request(server).get('/users/1');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id', 1);
        });

        it('should return 200 if user ID is not found', async () => {
            const res = await chai.request(server).get('/users/999');
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('error', 'User not found');
        });
    });

    describe('POST /users', () => {
        it('should create a new user', async () => {
            const newUser = {
                uid: 'new-uid',
                email: 'newuser@example.com',
                provider: 'google',
            };
            const res = await chai.request(server).post('/users').send(newUser);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('uid', 'new-uid');
        });

        it('should return 400 for invalid user data', async () => {
            const invalidUser = { email: 'invalidemail' };
            const res = await chai.request(server).post('/users').send(invalidUser);
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
        });
    });

    describe('PATCH /users/:id', () => {
        it('should update an existing user', async () => {
            const updates = { username: 'updated-username' };
            const res = await chai.request(server).patch('/users/1').send(updates);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'User updated successfully');
        });

        it('should return 404 if user ID is not found', async () => {
            const updates = { username: 'nonexistent' };
            const res = await chai.request(server).patch('/users/999').send(updates);
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error', 'User not found');
        });

        it('should return 400 if no updates are provided', async () => {
            const res = await chai.request(server).patch('/users/1').send({});
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error', 'Update params object is required');
        });
    });
});