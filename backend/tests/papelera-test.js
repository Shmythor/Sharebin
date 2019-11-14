const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const app = require('../server/server');

// Id del cliente Test: 5dcc3b6e68cdd20eb4017d97
// Para sacar los documentos de cliente test usar
// el filtro {"clientId":"5dcc3b6e68cdd20eb4017d97"}

const url= 'http://localhost:3000';
chai.use(chaiHttp);

describe("Test de papelera 1", () => {
    it("se debe poder enviar un documento a la papelera", (done) => {
        // let original = {"id":"5dcd52c00d7d3512b7a11890"};
        let docID = "5dcd52c00d7d3512b7a11890";
        let change = {
            "name": "worki.png",
            "description": "worki.png",
            "path": "6c8476ce-b8a5-427f-964a-7cc1892eb9e6.png",
            "createDate": "2019-11-14T13:30:50.975Z",
            "updateDate": "2019-11-14T13:30:50.975Z",
            "size": 19924,
            "type": "image/png",
            "isDeleted": true,
            "id": "5dcd52c00d7d3512b7a11890",
            "clientId": "5dcc3b6e68cdd20eb4017d97"
          }

        chai.request(url)
        .put(`/api/documents/${docID}`)
        .set('content-type', 'application/json')
        .send(change, docID)
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

describe("Test de papelera 2", () => {
    it("se debe poder recuperar un documento de la papelera", (done) => {
        // let original = {"id":"5dcd52c00d7d3512b7a11890"};
        let docID = "5dcd52c00d7d3512b7a11890";
        let change = {
            "name": "worki.png",
            "description": "worki.png",
            "path": "6c8476ce-b8a5-427f-964a-7cc1892eb9e6.png",
            "createDate": "2019-11-14T13:30:50.975Z",
            "updateDate": "2019-11-14T13:30:50.975Z",
            "size": 19924,
            "type": "image/png",
            "isDeleted": false,
            "id": "5dcd52c00d7d3512b7a11890",
            "clientId": "5dcc3b6e68cdd20eb4017d97"
          }

        chai.request(url)
        .put(`/api/documents/${docID}`)
        .set('content-type', 'application/json')
        .send(change, docID)
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

// id del doc para la prueba de borrar 5dcd62660d7d3512b7a11892
describe("Test de papelera 3", () => {
    it("se debe poder borrar definitivamente un documento de la papelera", (done) => {
        let docID = "5dcd62660d7d3512b7a11892";

        chai.request(url)
        .delete(`/api/documents/${docID}`)
        // .set('content-type', 'application/json')
        .send(docID)
        .end((err, res) => {
            if(err) {
                console.log('An error ocurred: ', err)
            }
            expect(res).to.have.status(200);
            done();
        })
    })
})