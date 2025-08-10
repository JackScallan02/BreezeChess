import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:9001';
chai.use(chaiHttp);

describe('Pieces API', function () {

    describe('GET /pieces', () => {
        it('should fetch all pieces with no provided user_id', async () => {
            const res = await chai.request(API_BASE_URL).get('/pieces');
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
        it('should fetch all pieces with a provided user_id', async () => {
            const res = await chai.request(API_BASE_URL).get('/pieces').query({user_id: 1});
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(2);
            expect(res.body[0]).to.haveOwnProperty('piece_id');
            expect(res.body[0]).to.haveOwnProperty('piece_name');
            expect(res.body[0]).to.haveOwnProperty('description');
            expect(res.body[1]).to.haveOwnProperty('piece_id');
            expect(res.body[1]).to.haveOwnProperty('piece_name');
            expect(res.body[1]).to.haveOwnProperty('description');
            expect(res.body[0].rarity).to.equal('common');
            expect(res.body[1].piece_name).to.equal('Default')
        });
        it('should fetch a board by id', async () => {
            const res = await chai.request(API_BASE_URL).get('/pieces/1');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.haveOwnProperty('id');
            expect(res.body).to.haveOwnProperty('description');
            expect(res.body).to.haveOwnProperty('name');
        });
    });
});