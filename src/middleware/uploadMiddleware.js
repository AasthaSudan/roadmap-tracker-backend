const multer = require("multer");
const path = require("path");

// Storage Configuration
const storage = multer.diskStorage({ // diskStorage is used to specify the destination and filename of the uploaded files
    destination: (req, file, cb) => {
        cb(null, "src/uploads/"); // sets the destination folder for uploaded files, cb is a callback function that is used to pass the error or the destination folder
    },

    filename: (req, file, cb) => { // this function is used to generate a unique name for the uploaded file
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // generates a unique suffix for the filename
        const extension = path.extname(file.originalname); // gets the extension of the uploaded file
        cb(null, `${uniqueSuffix}${extension}`); // concatenates the unique suffix and the extension to generate the final filename
    }

});

// Allowed MIME Types
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf"
];

// File Filter
const fileFilter = (req, file, cb) => { //this function filters the uploaded files based on their type

    if (!allowedMimeTypes.includes(file.mimetype)) { //checks if the file type is in the allowed types array
        return cb(new Error("Invalid file type"), false); //rejects the file if its type is not in the allowed types array
    }

    cb(null, true); //accepts the file

};

// Upload Middleware
const upload = multer({ //multer is used to handle file uploads
    storage, //storage configuration
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
    fileFilter //file filter

});

module.exports = upload;