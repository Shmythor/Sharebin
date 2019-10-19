'use strict';

const app = require('../../server/server');
module.exports = function(Metadata) {
    /*Metadata.sharedClass.methods().forEach(function(method) {
        console.log(method.name);
    });*/

    Metadata.observe('before save', function checkDocumentExists(ctx, next) {
        const Document = app.models.Document;
        if (ctx.instance) {
            Document.findById(ctx.instance.documentId, function(err, instance) {
                if (instance) {
                    console.log('Metadata was created ' + ctx.instance.value);
                    next();
                } else {
                    next(new Error('Cant find the doucment with id: ' + ctx.instance.documentId));
                }
            });
        }
    });
};