'use strict';

let App = require('../../server/server');
const crypto = require('crypto');
const request = require("request");

let ModifCheckParams = ["name", "description", "path", "url", "size", "type", "isDeleted" ]
module.exports = function (Document) {
  // clientId mantatory
  Document.validatesPresenceOf('clientId');

  Document.observe('after save', function creationAuditor(ctx, next) {
    if (ctx.isNewInstance)
      Document.createAuditorDocument(ctx.instance.id, "CREATED")

    next();
  });
  Document.observe('before save', function createAuditorsAfterModify(ctx, next) {
    if (ctx.isNewInstance) return next();
      ModifCheckParams.forEach((field) => {

        if (ctx.data !== undefined && (field in ctx.data) && (ctx.data[field] != ctx.currentInstance[field]))
          Document.createAuditorDocument(ctx.currentInstance.id, field, ctx.data[field], ctx.currentInstance[field])
          .then((auditor) => {
            console.log("SE HA CREADO AUDITOR");
          })
          .catch(err => console.log(err));
      })

    next();
  });

  Document.createAuditorDocument = function(docId, field, newValue, oldValue) {
    let Auditor = App.models.Auditor;

    return Auditor.upsert({documentId: docId, modified_elem: field, old_value: oldValue, new_value: newValue})
  }

  Document.download = function (req, res, documentId, cb) {
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

  Document.createURL = function (documentId, cb) {
    Document.findById(documentId).then((data) => {
      if (!data.urlToShare || data.urlToShare.length === 0 || data.urlToShare === "string") {
        let url = crypto.randomBytes(20).toString('hex');
        data.urlToShare = url;
        data.save();
        return url;
      }else {
        return data.urlToShare;
      }
    }).then((url) => cb(null, url))
      .catch(err => cb(err));
  };

  Document.downloadByLink = function(req, res, url, cb){
    Document.findOne({where :{urlToShare: url}}).then((document)=>{
      return Document.download(req,res,document.id, cb);
    }).catch(err => cb(err))
  };

  Document.deleteMetadata = function(documentId, metaID, cb){
    let host = "localhost";
    let port = ":3000";
    let path = `/documents/${documentId}/metadatas/${metaID}`;
    let url = host + port + path
    request.post(url, { json: true } ,(err, res, body) => {
      if (err) { return console.log(err); }
      console.log(res)
    });    
  };

  Document.remoteMethod('download', {
    description: "Downloads the document with the specified Id",
    accepts: [
      {arg: 'req', type: 'object', http: {source: 'req'}},
      {arg: 'res', type: 'object', http: {source: 'res'}},
      {arg: 'documentId', type: 'string'}
    ],
    returns: [
      {arg: 'body', type: 'file', root: true},
      {arg: 'Content-Type', type: 'string', http: {target: 'header'}}
    ],
    http: {verb: 'GET', path: '/:documentId/download'}
  });

  Document.remoteMethod('createURL', {
    description: "Create a random url to share",
    accepts: [
      {arg: 'documentId', type: 'string'}
    ],
    returns: [
      {arg: 'url', type: 'string', root: true}
    ],
    http: {verb: 'GET', path: '/createURL'}
  });

  Document.remoteMethod('downloadByLink',{
    description: "Download the file by the shared url",
    accepts: [
      {arg: 'req', type: 'object', http: {source: 'req'}},
      {arg: 'res', type: 'object', http: {source: 'res'}},
      {arg: 'url', type: 'string'}
    ],
    returns: [
      {arg: 'body', type: 'file', root: true},
      {arg: 'Content-Type', type: 'string', http: {target: 'header'}}
    ],
    http: {verb: 'GET', path: '/downloadByLink/:url'}
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
