const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({ //creates an object capable of sending emails using SMTP

    host: process.env.SMTP_HOST, //the smpt server that will send emails (e.g. Gmail's SMTP server)
    port: process.env.SMTP_PORT, //the port to connect to the SMTP server (587 is standard for TLS)

    secure: false, //false means TLS is used

    auth: { //authentication (login) credentials for the SMTP server
        user: process.env.SMTP_USER, //your email address
        pass: process.env.SMTP_PASS //your email password

    }
});

module.exports = transporter; 