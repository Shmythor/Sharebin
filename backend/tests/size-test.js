const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

// "root": "/home/crigasro/Escritorio/Sharebin/backend/server/storage",

chai.use(chaiHttp);
const url= 'http://localhost:3000';

let testClient = { 
    "username": 'Test',
    "email": 'test1@doe.com', 
    "password": 'password', 
    "name": 'Test', 
    "createDate": Date.now() 
};

describe('Insert a client: ',()=>{

	it('should insert a client', (done) => {
		chai.request(url)
			.post('/api/Clients')
			.send(testClient)
			.end((err,res) => {
				console.log(res.body)
				expect(res).to.have.status(200);
				done();
			});
	});
});
