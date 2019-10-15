module.exports = function(Folder) {
    /*
    Folder.findOne = function(filter, data, cb)
    {
        console.log(filter)
        console.log(data)
        console.log(cb)
        Folder.getContainer(filter.where.clientId.toString(), (err, folder) => cb(err, folder));
    }

    Folder.findOrCreate = function(filter, data, _, cb) {
        data.name = data.clientId.toString();
        console.log(filter);
        console.log(data);
        Folder.getContainer(filter.where.id, function(err, folder) {
            if (!folder) {
                Folder.createContainer(data, function(err, createdFolder) {
                    return cb(err, createdFolder);
                });
            } else {
                return cb(err, folder);
            }
        });
    }
    */
};