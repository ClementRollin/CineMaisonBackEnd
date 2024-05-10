const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com', // email
                pass: 'your-password' // password
            }
        });
    }

    async sendMail(to, subject, text) {
        const mailOptions = {
            from: 'your-email@gmail.com', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
        };

        return this.transporter.sendMail(mailOptions);
    }
}

module.exports = EmailService;