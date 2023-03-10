/* eslint-disable @typescript-eslint/no-non-null-assertion */
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Logger from 'bunyan';
import sendGridMail from '@sendgrid/mail';
import { config } from '@root/config';
import { BadRequestError } from '../../globals/helpers/error-handler';

interface IMailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

const logger: Logger = config.createLogger('EmailOptions');

sendGridMail.setApiKey(config.SENDGRID_API_KEY as string);

class MailTransport {
    public async sendEmail(receiverEmail: string, subject: string,  body: string): Promise<void> {
        if(config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
            this.developmentEmailSender(receiverEmail, subject, body);
        } else {
            this.productionEmailSender(receiverEmail, subject, body);
        }
    }

    private async developmentEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {
        // create reusable transporter object using the default SMTP transport
        const transporter: Mail = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: config.SENDER_MAIL_ID!, // generated ethereal user
            pass: config.SENDER_MAIL_PD!, // generated ethereal password
            },
        });

        const mailOptions: IMailOptions = {
            from: `SquaredR Socialize <${config.SENDER_MAIL_ID}>`,
            to: receiverEmail,
            subject,
            html: body
        };

        try {
            await transporter.sendMail(mailOptions);
            logger.info('Development Email Sent Successfully...');
        } catch (error) {
            logger.error(error);
            throw new BadRequestError('Error while sending mail :(');
        }
    }

    private async productionEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {

        const mailOptions: IMailOptions = {
            from: `SquaredR Socialize <${config.SENDER_MAIL_ID}>`,
            to: receiverEmail,
            subject,
            html: body
        };

        try {
            await sendGridMail.send(mailOptions);
            logger.info('Production Email Sent Successfull');
        } catch (error) {
            logger.error(error);
            throw new BadRequestError('Error while sending mail :(');
        }
    }
}

export const mailTransport: MailTransport = new MailTransport();
