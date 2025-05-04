import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:9001';
chai.use(chaiHttp);

describe('Goals API', function () {

    describe('GET /goals', () => {
        it('should fetch all goals', async () => {
            const res = await chai.request(API_BASE_URL).get('/goals');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length.greaterThan(0);
        });
    });
});