'use strict';

let App = require('../../server/server');
module.exports = function(Client) {

    Client.observe('before save', function createClientStorage(user, next) {
        let FolderModel = App.models.Folder;
        if (user.isNewInstance)
            FolderModel.createContainer({name: user.email, path: user.email}, (err, folder) => {});
        
        next();
    });

    Client.uploadDocument = function(req, res, clientId, cb) {
        let Folder = App.models.Folder;
        let Client = App.models.Client;
        
        Client.findById(clientId)
            .then((userObject) => {
                if (!userObject)
                    throw new Error(`User with id ${clientId} not found`);

                return Folder.upload(req, res, {container: userObject.email})
            })
            .then((fileObj) => {
                let Document = App.models.Document;
                let documentData = fileObj.fields;
                let fileData = fileObj.files.file[0];

                //Parche por si llega como un array por alguna razon.
                if (typeof(documentData.description) == "array")
                    documentData.description = documentData.description[0]

                let documentObject = {
                    name: fileData.originalFilename,
                    size: fileData.size,
                    description: documentData.description,
                    path: fileData.name,
                    type: fileData.type,
                    clientId: clientId
                }
                Document.create(documentObject, function(err, object) {
                    cb(err, object);
                });
            })
            .catch(err => cb(err));
    }

    Client.remoteMethod('uploadDocument', {
        description: "Upload a new document. Arguments: \n" + 
        "file: File to upload\n" + 
        "*: Params for the document",
        accepts: [
            {arg: 'req', type: 'object', http: {source: 'req'}},
            {arg: 'res', type: 'object', http: {source: 'res'}},
            {arg: 'clientId', type: 'string'}
        ],
        returns: {arg: 'documentData', type: 'object', root: true},
        http: {verb: 'post', path: '/:clientId/uploadDocument'}
    });
    
};
