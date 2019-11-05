'use strict'

module.exports = {
    getModelActiveMethods: function(model, includeDisabled = false) {
        const activeRemoteMethods = model.sharedClass
            .methods({ includeDisabled: includeDisabled })
            .reduce((result, sharedMethod) => {
                Object.assign(result, {
                  [sharedMethod.name]: sharedMethod.isStatic,
                });
                return result;
              }, {});

        return activeRemoteMethods;
    }
}