import Queue, { Job } from 'bull';
import Logger from 'bunyan';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { config } from '@root/config';
import { IAuthJob } from '@auth/interfaces/auth.interface';
import { IEmailJob } from '@user/interfaces/user.interface';

type IBaseJobData = IAuthJob | IEmailJob;

let bullAdapter: BullAdapter[] = [];

export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
    queue: Queue.Queue;
    logger: Logger;

    constructor(queueName: string) {
        this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
        bullAdapter.push(new BullAdapter(this.queue));
        bullAdapter = [...new Set(bullAdapter)];
        serverAdapter = new ExpressAdapter();
        serverAdapter.setBasePath('/queues');

        createBullBoard({
            queues: bullAdapter,
            serverAdapter
        });

        this.logger = config.createLogger(`Queue: ${queueName}`);

        this.queue.on('completed', (job: Job) => {
            job.remove();
        });

        this.queue.on('global:completed', (jobId: string) => {
            this.logger.info(`Job: ${jobId} completed`);
        });

        this.queue.on('global:stalled', (jobId: string) => {
            this.logger.info(`Job: ${jobId} stalled`);
        });
    }

    protected addJob(name: string, data: IBaseJobData): void {
        this.queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } });
    }

    protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
        this.queue.process(name, concurrency, callback);
    }
}
