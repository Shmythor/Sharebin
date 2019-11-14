const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const app = require('../server/server');

// let DocumentModel = app.DocumentModel;

const url= 'http://localhost:3000';
chai.use(chaiHttp);

describe("Test de papelera 1", () => {
    it("se debe poder enviar un documento a la papelera", (done) => {
        // let original = {"id":"5dcd52c00d7d3512b7a11890"};
        let docID = "5dcd52c00d7d3512b7a11890";
        let toDelete = {"isDeleted": "true"};

        chai.request(url)
        .post(`/api/documents/${docID}`)
        // .set('content-type', 'application/json')
        .send(docID, toDelete)
        .end((err, res) => {
            if(err) {
                console.log('An error ocurred: ', err)
            }
            // console.log(res.body)
            expect(res).not.have.status(200);
            done();
        })
    })
})

describe("Test de papelera 2", () => {
    it("se debe poder recuperar un documento de la papelera", (done) => {
        // let original = {"id":"5dcd52c00d7d3512b7a11890"};
        let docID = "5dcd52c00d7d3512b7a11890";
        let toDelete = {"isDeleted": "true"};

        chai.request(url)
        .post(`/api/documents/${docID}`)
        // .set('content-type', 'application/json')
        .send(docID, toDelete)
        .end((err, res) => {
            if(err) {
                console.log('An error ocurred: ', err)
            }
            // console.log(res.body)
            expect(res).not.have.status(200);
            done();
        })
    })
})