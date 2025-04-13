import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9001';
chai.use(chaiHttp);

describe('Users API', function () {

    describe('GET /users', () => {
        it('should fetch all users with pagination and sorting', async () => {
            const res = await chai.request(API_BASE_URL).get('/users').query({ limit: 5, offset: 1, sort_by: 'id', order: 'asc' });
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.keys('id', 'uid', 'username', 'email', 'provider', 'is_new_user');
        
            // Check that limit is 5
            expect(res.body.length).to.be.at.most(5);
            // Check that response is sorted by id in ascending order
            const ids = res.body.map(user => user.id);
            expect(ids).to.deep.equal([...ids].sort((a, b) => a - b), 'IDs are not sorted in ascending order');
            // Check that offset is 1
            expect(res.body[0].id).to.be.greaterThan(1);
        });

        it('should fetch a user by uid', async () => {
            const res = await chai.request(API_BASE_URL).get('/users').query({ uid: 'test-uid' });
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.uid).to.equal('test-uid');
            expect(res.body.id).to.equal(1);
        });

        it('should fetch a user by email', async () => {
            const res = await chai.request(API_BASE_URL).get('/users').query({ email: 'godunfi923@gmail.com' });
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.email).to.equal('godunfi923@gmail.com');
            expect(res.body.id).to.equal(7);
        });

        it('should return 200 if user is not found', async () => {
            // Usually we would return a 404 here, but we handle the case where the user is not found on the frontend
            const res = await chai.request(API_BASE_URL).get('/users').query({ uid: 'nonexistent-uid' });
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('error', 'User not found');
        });
    });

    describe('GET /users/:id', () => {
        it('should fetch a user by ID', async () => {
            const res = await chai.request(API_BASE_URL).get('/users/1');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id', 1);
            expect(res.body).to.have.property('email', 'testemail1@gmail.com');
            expect(res.body).to.have.property('provider', 'google');
            expect(res.body).to.have.property('is_new_user', false);

            const res2 = await chai.request(API_BASE_URL).get('/users/4');
            expect(res2).to.have.status(200);
            expect(res2.body).to.be.an('object');
            expect(res2.body).to.have.property('id', 4);
        });

        it('should return 200 if user ID is not found', async () => {
            const res = await chai.request(API_BASE_URL).get('/users/999');
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error', 'User not found');
        });
    });

    describe('GET /users/:id/info', () => {
        it('should fetch user info by user ID', async () => {
            const res = await chai.request(API_BASE_URL).get('/users/1/info');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('user_id', 1);
            expect(res.body).to.have.property('country_id', 14);
        });
        it('should return 404 if user info is not found', async () => {
            const res = await chai.request(API_BASE_URL).get('/users/999/info');
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error', 'User info not found');
        });
    });

    describe('GET /users/:id/info?include=country', () => {
        it('should fetch user info by user ID', async () => {
            const res = await chai.request(API_BASE_URL).get('/users/1/info?include=country');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('user_id', 1);
            expect(res.body).to.have.property('country_id', 14);
            expect(res.body).to.have.property('country_name', 'Barbados');
            expect(res.body).to.have.property('country_code', 'BB');
        });
    });

    describe('POST /users', () => {
        it('should create a new user', async () => {
            const newUser = {
                uid: 'new-uid',
                email: 'newuser@example.com',
                provider: 'google',
            };
            const res = await chai.request(API_BASE_URL).post('/users').send(newUser);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('uid', 'new-uid');
            expect(res.body).to.have.property('email', 'newuser@example.com');
            expect(res.body).to.have.property('provider', 'google');
            expect(res.body).to.have.property('is_new_user', true);
        });

        it('should return 400 for invalid user data', async () => {
            const invalidUser = { email: 'invalidemail' };
            const res = await chai.request(API_BASE_URL).post('/users').send(invalidUser);
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
        });
    });

    describe('PATCH /users/:id', () => {
        it('should update an existing user', async () => {
            const updates = { username: 'updated-username' };
            const res = await chai.request(API_BASE_URL).patch('/users/1').send(updates);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'User updated successfully');

            const res2 = await chai.request(API_BASE_URL).get('/users/1');
            expect(res2).to.have.status(200);
            expect(res2.body).to.be.an('object');
            expect(res2.body).to.have.property('username', 'updated-username');
        });

        it('should return 404 if user ID is not found', async () => {
            const updates = { username: 'nonexistent' };
            const res = await chai.request(API_BASE_URL).patch('/users/999').send(updates);
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error', 'User not found');
        });

        it('should return 400 if no updates are provided', async () => {
            const res = await chai.request(API_BASE_URL).patch('/users/1').send({});
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error', 'Update params object is required');
        });
    });

    describe('PATCH /users/:id/info', () => {
        it('should update an existing user\'s info', async () => {
            const updates = { country_id: 43 };
            const res = await chai.request(API_BASE_URL).patch('/users/1/info').send(updates);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'User info updated successfully');

            const res2 = await chai.request(API_BASE_URL).get('/users/1/info');
            expect(res2).to.have.status(200);
            expect(res2.body).to.be.an('object');
            expect(res2.body).to.have.property('country_id', 43);
        });

        it('should return 404 if user ID is not found', async () => {
            const updates = { country_id: 31 };
            const res = await chai.request(API_BASE_URL).patch('/users/999/info').send(updates);
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error', 'User info not found');
        });

        it('should return 400 if no updates are provided', async () => {
            const res = await chai.request(API_BASE_URL).patch('/users/1/info').send({});
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error', 'Update params object is required');
        });
    });
});