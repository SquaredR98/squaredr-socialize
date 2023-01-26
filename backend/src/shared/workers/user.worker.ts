import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { userService } from '@services/database/user.service';

const logger: Logger = config.createLogger('authWorker');

class UserWorker {
    async addUserToDB(job: Job, done: DoneCallback): Promise<void> {
        try {
            const { value } = job.data;
            await userService.addUserData(value); // Add method to send data to db
            job.progress(100);
            done(null, job.data);
        } catch (error) {
            logger.error(error);
            done(error as Error);
        }
    }
}

export const userWorker: UserWorker = new UserWorker();