import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:9001';
chai.use(chaiHttp);

describe('Boards API', function () {

    describe('GET /boards', () => {
        it('should fetch all boards with no provided user_id', async () => {
            const res = await chai.request(API_BASE_URL).get('/boards');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.haveOwnProperty('id');
            expect(res.body[0]).to.haveOwnProperty('name');
            expect(res.body[0]).to.haveOwnProperty('description');
            expect(res.body[0]).to.haveOwnProperty('rarity');
            expect(res.body[0].rarity).to.equal('common');
            expect(res.body[1]).to.haveOwnProperty('id');
            expect(res.body[1]).to.haveOwnProperty('name');
            expect(res.body[1]).to.haveOwnProperty('description');
            expect(res.body[1]).to.haveOwnProperty('rarity');
            expect(res.body[1].rarity).to.equal('common');
        });
        it('should fetch all boards with a provided user_id', async () => {
            const res = await chai.request(API_BASE_URL).get('/boards').query({user_id: 1});
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(2);
            expect(res.body[0]).to.haveOwnProperty('board_id');
            expect(res.body[0]).to.haveOwnProperty('board_name');
            expect(res.body[0]).to.haveOwnProperty('description');
            expect(res.body[1]).to.haveOwnProperty('board_id');
            expect(res.body[1]).to.haveOwnProperty('board_name');
            expect(res.body[1]).to.haveOwnProperty('description');
            expect(res.body[0].rarity).to.equal('common');
            expect(res.body[1].board_name).to.equal('Yellow-700')
        });
        it('should fetch a board by id', async () => {
            const res = await chai.request(API_BASE_URL).get('/boards/1');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('id');
            expect(res.body).to.haveOwnProperty('description');
            expect(res.body).to.haveOwnProperty('name');
        });
    });
});