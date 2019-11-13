const http = require('http');
const fs = require('fs');
const path = require('path');
// const assert = require('assert');
const describe = require('mocha').describe
const app = require('../server/server');


let ClientModel = app.models.Client;
let DocumentModel = app.models.Document;

describe("Create user test", async () => {
    // borrar antes y depués del test
    let client = { 
        username: 'Test',
        email: 'test1@doe.com', 
        password: 'password', 
        name: 'Test', 
        createDate: Date.now() 
    };
    let testID;
    try {
        // await insertTestClient(client);
        await deleteTestClient()
        await insertTestClient(client);
        testID = await getTestID();
    } catch(err) {
        console.log('An error ocurred during insertTestClient and/or deleteTestClient: ', err);
    }

    it("File size limited to 20MB", () => {
        let direction = path.join(__dirname, '/git_gia.pdf');
        console.log('File direction to use in postFile method: ',direction);
        console.log('Test id to use in postFile method: ', testID);
        let file = fs.readFileSync(direction);
        postFile(file, testID, "Archivo test de subida")
    })

})

    
function insertTestClient(client) {
    return new Promise(async (resolve, reject) => {
        console.log('\n> insertTestClient() STARTED\n');
        let created = await ClientModel.upsert(client);
        console.log('\nTest user registered:\n', created, '\n');
        resolve();
    })
}

function deleteTestClient() {
    return new Promise((resolve, reject) => {
        // let id = getTestID();
        console.log('\n> deleteTestClient() STARTED\n');
        getTestID().then((id) => {
            ClientModel.destroyById(id, (err) => {
                if(err) {
                    console.log('Error ocurred while destroyById: ', err);
                    reject();
                } else {
                    resolve(console.log('Test user deleted'));
                }
            })
        })
        .catch((err) => {
            console.log('An error ocurred at deleteTestClient PROMISE: ', err)
        })

    })
}

function getTestID() {
    return new Promise((resolve, reject) => {
        console.log('\n> getTestID() STARTED\n');
        ClientModel.find({username: "Test"}, (err, instances) => {
            if(err) {
                console.log('Ocurred while deleteTestClient: ', err);
                reject();
            }
            let id;
            // console.log('\n', '\n', 'INSTANCES:\n', instances, '\n');
            for(ins of instances) {
                if(ins.name == 'Test') {
                    id = ins.getId();
                    console.log('\n\nANDA MIRA, LA ID QUE QUIERES: ', id)
                    resolve(id);
                }
            }
        })
    })
}

function postFile(fileToUpload, clientId, description) {
    // const endpoint = `http://localhost:3000/api/Clients/${clientId}/uploadDocument`;

    let options = {
        hostname: 'localhost',
        port: 3000,
        path: `/api/Clients/${clientId}/uploadDocument`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Type': 'multipart/form-data'
        }
    }

    let req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
          console.log('No more data in response.');
        });
    })

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });      

    // const formData: FormData = new FormData();
    // formData.append('file', fileToUpload, fileToUpload.name);
    // formData.append('description', description);


    // const params = new HttpParams();
    // const headers = new HttpHeaders();

    // headers.append('Content-Type', 'application/json');
    // headers.append('Content-Type', 'multipart/form-data');

    // const options = {
    //   params,
    //   reportProgress: true,
    //   headers
    // };

    // const req = new HttpRequest('POST', endpoint, formData, options);

    // return this.http.request(req);
  }