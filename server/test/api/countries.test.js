import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9001';
chai.use(chaiHttp);

describe('Countries API', function () {

    describe('GET /countries', () => {
        it('should fetch all countries', async () => {
            const res = await chai.request(API_BASE_URL).get('/countries');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length.greaterThan(0);
            expect(res.body[0]).to.have.property('iso_code');
            expect(res.body[0]).to.have.property('name');
        });
    });
});