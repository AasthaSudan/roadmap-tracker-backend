const prisma = require("../config/prisma");

exports.saveMetadata = async (data) => { // saving file meta-data to the database after uploading it to the cloud
    return await prisma.file.create({ // prisma creates the entry in the database for the file based on the metadata provided in data
        data
    });
};