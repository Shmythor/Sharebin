// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

module.exports = function populateClientsModel(app) {
    let ClientModel = app.models.Client;
    console.log(Object.keys(app.models));
    

    // Search by ID: if exists update, else create
    let clientsArr = [
        {username: 'Juan', email: 'john1@doe.com', password: 'password', name:'John', createDate: Date.now()},
        {username: 'Yein', email: 'jane1@doe.com', password: 'password', name:'Jane', createDate: Date.now()},
        {username: 'Bobobo', email: 'bob1@projects.com', password: 'password', name:'Bob', createDate: Date.now()}
    ]
    
    clientsArr.forEach(cli => {
        ClientModel.findOne({where: {email: cli.email}, limit: 3})
            .then((err, clienteEncontrado) => {
                if (clienteEncontrado)
                    return ClientModel.destroyById(clienteEncontrado.id)
            })
            .then(() => ClientModel.create(cli))
            .then((err, total) => {
                    if(err) {
                        console.log(err);
                    } else {
                        let FolderModel = app.models.Folder;
                        FolderModel.createContainer({name: total.email}, (err, folder) => {});
        
                        console.log('Creating client:', total);
                    }
            });
    })

};