const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');


// "root": "/home/crigasro/Escritorio/Sharebin/backend/server/storage",

chai.use(chaiHttp);
const url= 'http://localhost:3000';

// ID of the Test client (already registered)
let testClientID = "5dcc3b6e68cdd20eb4017d97";

// Este test funciona, pero para no marear lo comento
// Además no entraría para estos test
// describe('Insert a client: ',()=>{

// 	it('should insert a client', (done) => {
// 		chai.request(url)
// 			.post('/api/Clients')
// 			.send(testClient)
// 			.end((err, res) => {
//                 console.log(res.body)
//                 testClientID = res.body.id;
//                 console.log(testClientID)
// 				expect(res).to.have.status(200);
// 				done();
// 			});
// 	});
// });

describe("File size limit test", () => {
    let direction = path.join(__dirname, '/git_guia.pdf');   
    let file = fs.readFileSync(direction);
    let description = "Archivo test de subida";

    let formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('description', description);
    
    it("should POST a file under 20MB", () => {
        chai.request(url)
            .post(`/api/Clients/${testClientID}/uploadDocument`)
            .set('content-type', 'application/x-www-form-urlencoded')
            // .send({myparam: 'test'})
            .send(formData)
            .end((err, res) => {
                if(err) {
                    console.log('An error ocurred: ', err)
                }
                // console.log(res.body)
				expect(res).to.have.status(200);
				done();
            })
    })
})