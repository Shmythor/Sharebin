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

// Test that we can get a user to test the files with.
describe("Getting user...", () => {
    let formData = new FormData();
    
    it("Get first user from database", (done) => {
        chai.request(url)
            .get(`/api/Clients/`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                if(err) {
                    console.log('An error ocurred: ')
                }
                testClientID = res.body[0].id;
                // console.log(res.body)
				expect(res).to.have.status(200);
				done();
            })
    })
})
 
// Test that a file under 20MB can be uploaded
describe("File size limit test 1", () => {
    let fileName = 'git_guia.pdf';
    let filePath = path.join(__dirname, '/' + fileName);   
    let description = "Archivo test de subida";

    
    it("should POST a file under 20MB", (done) => {
        chai.request(url)
            .post(`/api/Clients/${testClientID}/uploadDocument`)
            .set('content-type', 'application/x-www-form-urlencoded')
            .attach('file', filePath, fileName)
            .field('description', description)
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

// Test that a file over 20MB cannot be uploaded
describe("File size limit test 2", () => {
    let fileName = "video.mp4";
    let filePath = path.join(__dirname, '/' + fileName);   

    let description = "Archivo test de subida";
    
    it("should NOT POST a file OVER 20MB", (done) => {
        chai.request(url)
            .post(`/api/Clients/${testClientID}/uploadDocument`)
            .set('content-type', 'application/x-www-form-urlencoded')
            .attach('file', filePath, fileName)
            .field('description', description)
            .end((err, res) => {
				expect(res).not.have.status(200);
                done();
            })
    })
})