// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
let fs = require('fs');
let path = require('path');

module.exports = function populateClientsModel(app) {
    let ClientModel = app.models.Client;
    let FolderModel = app.models.Folder;

    // // Default files for demo porpuses
    // let demoFilesPath = [
    //     path.resolve(__dirname + '../../../demo_files/Fichero1.txt')
    // ]

    // let demoDescriptions = [
    //     'Descipcion del fichero 1'
    // ]

    // let fileToUpload = fs.readFileSync(demoFilesPath[0]);

    // Search by ID: if exists update, else create
    let clientsArr = [
        { username: 'Juan', email: 'john1@doe.com', password: 'password', name: 'John', createDate: Date.now() },
        { username: 'Yein', email: 'jane1@doe.com', password: 'password', name: 'Jane', createDate: Date.now() },
        { username: 'Bobobo', email: 'bob1@projects.com', password: 'password', name: 'Bob', createDate: Date.now() }
    ]

    clientsArr.forEach(cli => {
        ClientModel.upsert(cli, (err, total) => {
            if (err && err.statusCode != 422) { // Evitar mostrar error de usuario ya existente.
                console.log(err);
            } else {
                console.log("Client created correctly: ", total);
            }
        });
    });

    

};