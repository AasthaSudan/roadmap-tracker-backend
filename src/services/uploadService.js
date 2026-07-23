const prisma = require("../config/prisma");
const fs = require("fs/promises"); // filesystem module for file operations

const saveFileMetadata = async (file) => { //save the file metadata to the database
    const uploadedFile = await prisma.file.create({
        data: {
            originalName: file.originalname, //filename from the user
            fileName: file.filename, //generated filename
            mimeType: file.mimetype, //file type
            size: file.size, //file size
            path: file.path //file path
        }
    });
    return uploadedFile;
};

const deleteFile = async (id) => {

    const file = await prisma.file.findUnique({
        where: {
            id: Number(id)
        }
    });

    if (!file) {
        throw new Error("File not found");
    }

    // Delete physical file
    await fs.unlink(file.path);

    // Delete metadata
    await prisma.file.delete({
        where: {
            id: Number(id)
        }
    });
    return file;
};

module.exports = {
    saveFileMetadata,
    deleteFile
};