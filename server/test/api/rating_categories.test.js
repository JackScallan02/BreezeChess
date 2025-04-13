import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9001';
chai.use(chaiHttp);

describe('Rating Categories API', function () {

    describe('GET /rating_categories', () => {
        it('should fetch all rating categories', async () => {
            const res = await chai.request(API_BASE_URL).get('/rating_categories');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length.greaterThan(0);
        });
    });
});