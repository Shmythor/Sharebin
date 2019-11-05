'use strict';

let App = require('../../server/server');
module.exports = function(Document) {
    /*Document.sharedClass.methods().forEach(function(method) {
        console.log(method.name);
    });*/
    
    // clientId mantatory
    Document.validatesPresenceOf('clientId');

    Document.download = function(req, res, documentId, cb) {
        let Folder = App.models.Folder;
        let Client = App.models.Client;
        let documentObject;
        
        Document.findById(documentId)
            .then((data) => {
                if (!data)
                    throw new Error(`Document with id ${documentId} not found`);
                
                console.log(data);
                documentObject = data;
                return Client.findById(documentObject.clientId);
            })
            .then((clientObject) => {
                if (!clientObject)
                    throw new Error(`The user associated with the document with id ${documentId} doesn't exist`);
                
                return Folder.download(clientObject.email, documentObject.path, req, res);
            })
            .then((file) => cb(null, file))
            .catch(err => cb(err));      
    }

    Document.remoteMethod('download', {
        description: "Downloads the document with the specified Id",
        accepts: [
            {arg: 'req', type: 'object', http: {source: 'req'}},
            {arg: 'res', type: 'object', http: {source: 'res'}},
            {arg: 'documentId', type: 'string'}
        ],
        returns: [
            { arg: 'body', type: 'file', root: true },
            { arg: 'Content-Type', type: 'string', http: { target: 'header' } }
        ],
        http: {verb: 'GET', path: '/:documentId/download'}
    });

    Document.observe('before delete', (ctx, next) => {
        // console.log('Deleted %s matching %j',
        //   ctx.Model.pluralModelName,
        //   ctx.where);

        //console.log('El ctx: ', ctx)

        let Folder = App.models.Folder;
        let Client = App.models.Client;
        let document;

        console.log(ctx.where);

        let docID = ctx.where.id;

        Document.findById(docID)
        .then((doc) => {
            document = doc;
            return Client.findById(document.clientId);
        })
        .then((client) => {
            return Folder.removeFile(client.email, document.path);
        })
        .then((stdout) => {
            console.log('Removing file completed');
        })
        .catch((err) => {
            console.log('Error while removing document file: ', err);
        });

        next();
      });
      

};
