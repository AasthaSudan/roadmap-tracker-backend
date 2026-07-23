const uploadService = require("../services/uploadService");

const uploadFile = async (req, res, next) => { // handles file upload requests
    try {
        if (!req.file) { // if no file is uploaded
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
            });
        }

        const uploadedFile = await uploadService.saveFileMetadata(req.file); //calls the upload service function to save the file metadata

        return res.status(201).json({ //returns the uploaded file data
            success: true,
            message: "File uploaded successfully.",
            data: uploadedFile
        });

    } catch (error) { //catches and passes on the error to the error-handling middleware for proper error response
        next(error);
    }
};

const deleteFile = async (req, res, next) => { // handles file delete requests
    try {
        await uploadService.deleteFile(req.params.id); //calls the upload service function to delete the file metadata and the file itself

        res.json({
            success: true,
            message: "File deleted successfully."
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    uploadFile,
    deleteFile
};