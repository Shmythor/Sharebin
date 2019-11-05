'use strict';

let App = require('../../server/server');
const crypto = require('crypto');

module.exports = function (Document) {
  /*Document.sharedClass.methods().forEach(function(method) {
      console.log(method.name);
  });*/

  // clientId mantatory
  Document.validatesPresenceOf('clientId');

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
  }

  Document.downloadByLink = function(req, res, url, cb){
    Document.findOne({where :{urlToShare: url}}).then((document)=>{
      return Document.download(req,res,document.id, cb);
    }).catch(err => cb(err))
  }

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

};
