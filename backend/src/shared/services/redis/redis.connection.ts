import Logger from 'bunyan';
import { config } from '@root/config';
import { BaseCache } from '@services/redis/base.cache';

const logger: Logger = config.createLogger('redisConnection');

class RedisConnection extends BaseCache {
    constructor() {
        super('redisConnection');
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();
            const res = await this.client.ping();
            logger.info('Redis connected successfully: ', res);
        } catch (error) {
            logger.error(error);
        }
    }
}

export const redisConnection: RedisConnection = new RedisConnection();
