import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:9001';
chai.use(chaiHttp);

describe('User_Ratings API', function () {

    describe('GET /user_ratings', () => {
        it('should fetch all user ratings', async () => {
            const res = await chai.request(API_BASE_URL).get('/user_ratings');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property('user_id', 1);
            expect(res.body[0]).to.have.property('category_id', 2);
            expect(res.body[0]).to.have.property('rating', 1300);
            expect(res.body[1]).to.have.property('user_id', 1);
            expect(res.body[1]).to.have.property('category_id', 3);
            expect(res.body[1]).to.have.property('rating', 1500);
        });

        it('should fetch all user_ratings for a given user id', async () => {
            const res = await chai.request(API_BASE_URL).get('/user_ratings').query({ user_id: 2 });
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length.greaterThan(0);
        });

        it('should fetch a user_rating for a given user id and category', async () => {
            const res = await chai.request(API_BASE_URL).get('/user_ratings').query({ user_id: 2, category_id: 4});
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(1);
            expect(res.body[0]).to.have.property('user_id', 2);
            expect(res.body[0]).to.have.property('category_id', 4);
            expect(res.body[0]).to.have.property('rating', 2000);
        });

        it('should fetch a user_rating for a given category', async () => {
            const res = await chai.request(API_BASE_URL).get('/user_ratings').query({ category_id: 3});
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(1);
            expect(res.body[0]).to.have.property('user_id', 1);
            expect(res.body[0]).to.have.property('category_id', 3);
            expect(res.body[0]).to.have.property('rating', 1500);
        });

    });

    describe('PUT /user_ratings', () => {
        it('should create a new user rating if it does not exist', async () => {
            const newUserRating = {
                user_id: 2,
                category_id: 5,
                rating: 1600,
            };
            const res = await chai.request(API_BASE_URL).put('/user_ratings').send(newUserRating);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property('user_id', 2);

            const res2 = await chai.request(API_BASE_URL).get('/user_ratings').query({ user_id: 2, category_id: 5});
            expect(res2).to.have.status(200);
            expect(res2.body).to.be.an('array');
            expect(res2.body).to.have.lengthOf(1);
            expect(res2.body[0]).to.have.property('user_id', 2);
            expect(res2.body[0]).to.have.property('category_id', 5);
            expect(res2.body[0]).to.have.property('rating', 1600);
        });

        it('should return 400 for no user_id', async () => {
            const res = await chai.request(API_BASE_URL).put('/user_ratings').send({ category_id: 5, rating: 600 });
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
        });

        it('should return 400 for no category_id', async () => {
            const res = await chai.request(API_BASE_URL).put('/user_ratings').send({ user_id: 5, rating: 600 });
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
        });
        
        it('should return 400 for no rating', async () => {
            const res = await chai.request(API_BASE_URL).put('/user_ratings').send({ user_id: 5, category_id: 3 });
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
        });

        it('should return 404 for nonexistent user', async () => {
            const invalidUser = { user_id: 999, rating: 600, category_id: 2 };
            const res = await chai.request(API_BASE_URL).put('/user_ratings').send(invalidUser);
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
        });

        it('should return 404 for nonexistent category', async () => {
            const invalidCategory = { user_id: 2, rating: 600, category_id: 999 };
            const res = await chai.request(API_BASE_URL).put('/user_ratings').send(invalidCategory);
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
        });
    });
});