import mongoose from 'mongoose';
import { config } from '@root/config';
import Logger from 'bunyan';
import { redisConnection } from '@services/redis/redis.connection';

const log: Logger = config.createLogger('database-setup');

export default () => {
    const connect = () => {
        mongoose.set('strictQuery', false);
        mongoose
            .connect(`${config.DATABASE_URL}`, {
                user: `${config.DATABASE_USR}`,
                pass: `${config.DATABASE_PAS}`,
                dbName: 'squaredr-socialize-backend'
            })
            .then(() => {
                log.info('Successfully connected to database.');
                redisConnection.connect();
            })
            .catch((error) => {
                log.error(error);
                return process.exit(1);
            });
    };
    connect();
    mongoose.connection.on('disconnected', connect);
};

// w38icC9LWTKLqEH
