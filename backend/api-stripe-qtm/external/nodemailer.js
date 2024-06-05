const nodemailer = require("nodemailer");
const configSMTP = require("./smtpConfig");
const templateHtmlGeneralSupportMail = require("../utils/mailTemplates/supportGeneralTemplate");

class MailService {

    mailerInstance;
    configSMTP;
    smtp

    constructor(instance, config){
        this.mailerInstance=instance;
        this.configSMTP=config;
        //transporter mail service
        this.smtp = this.mailerInstance.createTransport({
            service: "Gmail",
            auth: {
                user: this.configSMTP.user,
                pass: this.configSMTP.pass
            },
            tls: {
                rejectUnauthorized: false
            },
            secure: false
        });
    }

    async sendGeneralMail(emailContent, type) {

        const mail = {
            from: emailContent.name,
            to: this.configSMTP.user,
            subject: `E-mail enviado por ${emailContent.name}`,
            html: templateHtmlGeneralSupportMail(emailContent)
        }

        try {
            var response = await this.smtp.sendMail(mail);
            this.smtp.close();
            return this.errorHandling(response, false);
        } catch (error) {
            console.log(error);
            this.smtp.close();
            return this.errorHandling(error, true);
        }
    }

    errorHandling(data, error){
        if(error){
            return {status: 'error', data: data}
        }else{
            return {status: 'success', data: data}
        }
    }
}

module.exports = new MailService(nodemailer, configSMTP);