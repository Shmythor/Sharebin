'use strict'

let GeneralMethods = require('../../common/helpers/generalMethods.js');

module.exports = function(app) {
    let documentMethods = GeneralMethods.getModelActiveMethods(app.models.Document, true);

    //console.log(documentMethods);
}