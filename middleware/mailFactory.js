require( 'dotenv' ).config();

const smtpEnvVar = process.env['SMTP'];
if (!smtpEnvVar) {
    throw new Error('The $SMTP environment variable was not found!');
}
const keys = JSON.parse(smtpEnvVar);
const USERNAME = keys.USER;
const PASSWORD = keys.PSSWD;

const nodemailer = require('nodemailer');

const MESSAGES = {
    "NEW_USER": "Welcome to the documents manager app<br><br>A new account has been created using your email address<br><br>Your credentials are:<br>username: {{username}}<br>password: {{password}}<br><br>",
    "PSSWD_CHANGED": "Hello {{username}}<br><br>A password change request has been submitted for your account in Maple Bear's Documents Manager App, if you did not submit this request, please contact your administrator",
    "UPDATED_USER":"Hello {{username}},<br><br>You have made changes to your profile in Maple Bear's Document Manager App"
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: USERNAME,
        pass: PASSWORD,
    },
});

//transporter.verify().then(console.log).catch(console.error);

exports.sendEmailMessage = (subject, toAddress, username, email, password, type, res) => {
    let message = MESSAGES[type];
    // console.log("message to be sent: ",message);
    transporter.sendMail({
        from: '"no-reply" <'+USERNAME+'>', // sender address
        to: toAddress, // list of receivers
        subject: subject, // Subject line
        // text: "There is a new article. It's about sending emails, check it out!", // plain text body
        html: message.replace("{{username}}",username).replace("{{email}}",email).replace("{{password}}",password), // html body
    }).then(info => {
        res.status(200).json({
                "message": "success",
                "data": info
            }
        );
    }).catch( error => {
            res.status(418).json({
                    "message": "error",
                    "data": error
                }
            )
        }
    );
}

exports.sendEmailMessage = (subject, toAddress, username, email, password, type) => {
    let message = MESSAGES[type];
    // console.log("message to be sent: ",message);
    transporter.sendMail({
        from: '"no-reply" <'+USERNAME+'>', // sender address
        to: toAddress, // list of receivers
        subject: subject, // Subject line
        // text: "There is a new article. It's about sending emails, check it out!", // plain text body
        html: message.replace("{{username}}",username).replace("{{email}}",email).replace("{{password}}",password), // html body
    }).then(info => {
        console.log('Success: ',info);
    }).catch( error => {
        console.log('Error: ',error);
    });
}

exports.sendCustomEmail = (req, res) => {//subject, toAddress, message) => {
    const emailBody = {
        subject: req.body.subject,
        toAddress: req.body.toAddress,
        message: req.body.message
    }
    transporter.sendEmail({
        from: '"No reply"',
        to: emailBody.toAddress,
        subject: emailBody.subject,
        html: emailBody.message
    }).then( info => {
        res.status(200).send({ message: 'success', data: info });
    }).catch( error => {
        res.status(418).send({ message: 'error', error: error });
    });
}