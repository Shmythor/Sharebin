'use strict';

const app = require('../../server/server');
const frontEndUrl = 'http://localhost:4200';
const backEndUrl = 'http://localhost:3000';

module.exports = function (Metadata) {

  Metadata.observe('before save', function checkDocumentExists(ctx, next) {
    const Document = app.models.Document;
    if (ctx.instance) {
      Document.findById(ctx.instance.documentId, function (err, instance) {
        if (instance) {
          console.log('Metadata was created ' + ctx.instance.value);
          next();
        } else {
          next(new Error('Cant find the document with id: ' + ctx.instance.documentId));
        }
      });
    }
  });
};



