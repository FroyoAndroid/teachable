function MailService(nodemailer) {

    var configureMailTransport = function (hostAddr, portNo, adminMail, adminPassword) {
        // fill in the admin email and password to send mail
        var transportConfigObj = {
            host: hostAddr || 'smtp.gmail.com',
            port: portNo || 465,
            secure: true, // secure:true for port 465, secure:false for port 587
            auth: {
                user: adminMail || '',
                pass: adminPassword || ''
            }
        }
        var transporter = nodemailer.createTransport(transportConfigObj);
        return transporter;
    }

    this.sendMail = function (sender, receiver, mailSubject, content, htmlContent) {
        // setup email data with unicode symbols
        var mailOptions = {
                from: sender || '', // sender address
                to: receiver || '', // list of receivers
                subject: mailSubject || 'Registration', // Subject line
                text: content || 'Status of Registration', // plain text body
                html: htmlContent || '<b>Successfully Registered</b>' // html body
            },
            resolve, reject,
            mailPromise = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            }),
            transporter = configureMailTransport('smtp.gmail.com', 465,
             'ghosesoumya001@gmail.com', 'tubai98300$');
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else if (info) {
                console.log('Message %s sent: %s', info.messageId, info.response);
                resolve(info);
            }

        });
        return mailPromise;
    }
}

module.exports = MailService;