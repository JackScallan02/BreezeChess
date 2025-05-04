import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:9001';
chai.use(chaiHttp);

describe('User_Goals API', function () {

    describe('GET /user_goals', () => {
        it('should fetch all user goals', async () => {
            const res = await chai.request(API_BASE_URL).get('/user_goals');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property('id', 1);
            expect(res.body[0]).to.have.property('user_id', 1);
            expect(res.body[0]).to.have.property('goal_id', 2);
            expect(res.body[1]).to.have.property('id', 2);
            expect(res.body[1]).to.have.property('user_id', 2);
            expect(res.body[1]).to.have.property('goal_id', 1);
        });

        it('should fetch a user_goal by user id', async () => {
            const res = await chai.request(API_BASE_URL).get('/user_goals').query({ user_id: 2 });
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id', 2);
            expect(res.body).to.have.property('user_id', 2);
            expect(res.body).to.have.property('goal_id', 1);
        });

    });

    describe('POST /user_goals', () => {
        it('should create a new user goal', async () => {
            const newUserGoal = {
                user_id: 2,
                goal_ids: [3],
            };
            const res = await chai.request(API_BASE_URL).post('/user_goals').send(newUserGoal);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property('user_id', 2);
            expect(res.body[0]).to.have.property('goal_id', 3);

        });

        it('should return 400 for no goal id', async () => {
            const invalidUserGoal = { user_id: 1 };
            const res = await chai.request(API_BASE_URL).post('/user_goals').send(invalidUserGoal);
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
        });

        it('should return 400 for no user id', async () => {
            const invalidUserGoal = { goal_ids: 1 };
            const res = await chai.request(API_BASE_URL).post('/user_goals').send(invalidUserGoal);
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
        });

        it('should return 400 for invalid user data', async () => {
            const invalidUser = { email: '' };
            const res = await chai.request(API_BASE_URL).post('/user_goals').send(invalidUser);
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
        });
    });
});