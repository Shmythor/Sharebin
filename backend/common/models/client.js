'use strict';

var app = require('../../server/server');

module.exports = function(Client) {
    
    Client.observe('before save', function createClientStorage(user, next) {
        let FolderModel = app.models.Folder;
        if (user.isNewInstance) {
            FolderModel.createContainer({name: user.email, path: user.email}, (err, folder) => {});
        }
    })
};
