const express = require("express");
const multer = require("multer");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const uploadController = require("../controllers/uploadController");

router.post( //multer error handler for single file upload
    "/",
    (req, res, next) => { //custom middleware to catch multer errors before they reach the controller
        upload.single("file")(req, res, function (err) {
            if (err instanceof multer.MulterError) { // checking if the error is a multer error
                return res.status(400).json({ // if multer error, return error response
                    success: false,
                    error: err.message
                });
            }

            if (err) { // other errors
                return res.status(400).json({
                    success: false,
                    error: err.message
                });
            }
            next(); // if no error, pass to the next middleware
        });
    },
    uploadController.uploadFile // calling the upload controller
);


router.delete("/:id", uploadController.deleteFile);

module.exports = router;