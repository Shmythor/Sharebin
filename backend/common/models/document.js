'use strict';

let App = require('../../server/server');
module.exports = function(Document) {

    Document.upload = function(req, res, cb) {
        let Folder = App.models.Folder;

        Folder.upload(req, res, {container: 'bob1@projects.com'})
            .then((fileObj) => {
                let documentData = fileObj.fields;
                console.log(documentData);
                console.log(fileObj.fields);
                let fileData = fileObj.files.file[0];
                let documentObject = {
                    name: fileData.originalFilename,
                    size: fileData.size,
                    description: documentData.description,
                    path: fileData.name,
                    type: fileData.type
                }
                return Document.create(documentObject);
            })
            .then((docObj) => {
                cb(docObj)
            })
            .catch(err => cb(err));
    }

    Document.remoteMethod('upload', {
        description: "Upload a new document. Arguments: \n" + 
        "file: File to upload\n" + 
        "documentObject: Data for the document",
        accepts: [
            {arg: 'req', type: 'object', http: {source: 'req'}},
            {arg: 'res', type: 'object', http: {source: 'res'}},
        ],
        returns: {arg: 'documentData', type: 'object', root: true},
        http: {verb: 'post'}
    });
};
