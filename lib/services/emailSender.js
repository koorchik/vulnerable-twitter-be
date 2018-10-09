import pathModule            from 'path';
import fse                   from 'fs-extra';
import nodemailer            from 'nodemailer';
import Handlebars            from 'handlebars';
import sendmailTransport     from 'nodemailer-sendmail-transport';
import smtpTransport         from 'nodemailer-smtp-transport';
import stubTransport         from 'nodemailer-stub-transport';
import { promisifyAll }      from 'bluebird';

import config from './../../etc/config';

class EmailSender {
    constructor() {
        let transport;

        switch (config.mail.transport) {
            case 'SMTP':
                transport = smtpTransport(config.mail.transport_options);
                break;
            /* istanbul ignore next */
            case 'SENDMAIL':
                transport = sendmailTransport();
                break;
            /* istanbul ignore next */
            default:
                throw new Error('transport not fount');
        }
        const isTestMode = process.env.MODE === 'test';

        /* istanbul ignore next */
        if (isTestMode) {
            transport = stubTransport();
        }

        /* istanbul ignore next */
        const options  = isTestMode ? { directory: '/tmp' } : config.mail.transport_options;

        this.transport = promisifyAll(nodemailer.createTransport(transport, options));
        this.templates = {};
    }

    async send(type, destinationUser, data) {
        if (process.env.DEV) return console.log(type, destinationUser, data);

        const sendData = { ...data, mainUrl: config.mainUrl };
        const template = await this.getTemplates(type);

        const mailOptions = {
            from    : config.mail.from,
            to      : destinationUser,
            subject : template.subject(sendData),
            html    : template.body(sendData)
        };

        try {
            const response = await this.transport.sendMailAsync(mailOptions);

            return response.message;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async getTemplates(templateName) {
        if (!this.templates[templateName]) {
            const templatesDir = pathModule.join(__dirname, '/../../templates');

            const [ bodyTemplate, subjectTemplate ] = await Promise.all([
                fse.readFile(pathModule.join(templatesDir, templateName, 'body.html')),
                fse.readFile(pathModule.join(templatesDir, templateName, 'subject.html'))
            ]);

            this.templates[templateName] = {
                body    : Handlebars.compile(bodyTemplate.toString()),
                subject : Handlebars.compile(subjectTemplate.toString())
            };
        }

        return this.templates[templateName];
    }
}

export default new EmailSender();
