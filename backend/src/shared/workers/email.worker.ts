import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { mailTransport } from '@services/emails/mail.transport';

const logger: Logger = config.createLogger('EmailWorker');

class EmailWorker {
    async addNotificationEmailToQueue(job: Job, done: DoneCallback): Promise<void> {
        try {
            const { template, receiverEmail, subject } = job.data;
            await mailTransport.sendEmail(receiverEmail, subject, template);
            job.progress(100);
            done(null, job.data);
        } catch (error) {
            logger.error(error);
            done(error as Error);
        }
    }
}

export const emailWorker: EmailWorker = new EmailWorker();
