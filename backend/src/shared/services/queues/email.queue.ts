import { BaseQueue } from '@services/queues/base.queue';
import { IEmailJob } from '@user/interfaces/user.interface';
import { emailWorker } from '../../workers/email.worker';

class EmailQueue extends BaseQueue {
    constructor(){
        super('emails');
        this.processJob('forgotPasswordEmail', 5, emailWorker.addNotificationEmailToQueue);
    }

    public addEmailJobToQueue(name: string, data: IEmailJob) {
        this.addJob(name, data);
    }
}

export const emailQueue: EmailQueue = new EmailQueue();
