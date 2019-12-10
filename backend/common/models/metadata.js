'use strict';

const app = require('../../server/server');
module.exports = function (Metadata) {
  /*Metadata.sharedClass.methods().forEach(function(method) {
      console.log(method.name);
  });*/


  Metadata.observe('before save', function checkDocumentExists(ctx, next) {
    const Document = app.models.Document;
    if (ctx.instance) {
      Document.findById(ctx.instance.documentId, function (err, instance) {
        if (instance) {
          console.log(instance.metadatas);
          console.log(`Metadata was created with value: ${ctx.instance.value} 
                       key: ${ctx.instance.key} 
                       for document: ${ctx.instance.documentId}`);
          next();
        } else {
          next(new Error('Cant find the document with id: ' + ctx.instance.documentId));
        }
      });
    }
  });
};
