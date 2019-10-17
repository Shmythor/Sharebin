'use strict';

const app = require('../../server/server');
module.exports = function (Metadata) {

  Metadata.observe('before save', function checkDocumentExists(ctx, next) {
    const Document = app.models.Document;
    if (ctx.instance) {
      Document.findById(ctx.instance.documentId, function (err, instance) {
        if (instance) {
          if (instance.metadatas.filter(metadata => metadata.key === ctx.instance.key && metadata.value === ctx.instance.value).length === 0) {
            console.log('Metadata was created ' + ctx.instance.value);
            next();
          }
          console.log('Metadata with that key and value already exists ' + ctx.instance.value + " : " + ctx.instance.key);
        } else {
          next(new Error('Cant find the document with id: ' + ctx.instance.documentId));
        }
      });
    }
  });
};


