const nodemailer = require("nodemailer");
const config = require("./env");

const transporter = nodemailer.createTransport({

    host: config.smtp.host,
    port: config.smtp.port,

    secure: false, //false means TLS is used

    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass

    }
});

module.exports = transporter; 