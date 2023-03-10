import dotEnv from 'dotenv';
import bunyan from 'bunyan';
import cloudinary from 'cloudinary';

dotEnv.config({});

class Config {
    // ENVIRONMENT
    public NODE_ENV: string | undefined;

    // MONGO DB CONNECTION
    public DATABASE_URL: string | undefined;
    public DATABASE_USR: string | undefined;
    public DATABASE_PAS: string | undefined;

    // SECURE KEYS
    public SECRET_ONE: string | undefined;
    public SECRET_TWO: string | undefined;
    public JWT_SECRET_KEY: string | undefined;

    // FRONTEND URL
    public CLIENT_URL: string | undefined;

    // REDIS
    public REDIS_HOST: string | undefined;

    public CLOUD_NAME: string | undefined;
    public CLOUD_API_KEY: string | undefined;
    public CLOUD_API_SECRET: string | undefined;

    // MAILING CREDS
    public SENDER_MAIL_ID: string | undefined;
    public SENDER_MAIL_PD: string | undefined;
    public SENDGRID_API_KEY: string | undefined;
    public SENDGRID_SENDER: string | undefined;

    private readonly DEFAULT_DATABASE_URL = 'mongodb://localhost:27027/test';

    constructor() {
        this.NODE_ENV = process.env.NODE_ENV;

        this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
        this.DATABASE_USR = process.env.DATABASE_USR || '';
        this.DATABASE_PAS = process.env.DATABASE_PAS || '';

        this.SECRET_ONE = process.env.SECRET_ONE || '0123456789';
        this.SECRET_TWO = process.env.SECRET_TWO || '9876543210';
        this.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'squaredr@socialize';

        this.CLIENT_URL = process.env.DATABASE_URI || '';

        this.REDIS_HOST = process.env.REDIS_HOST;

        this.CLOUD_NAME = process.env.CLOUD_NAME;
        this.CLOUD_API_KEY = process.env.CLOUD_API_KEY;
        this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;

        this.SENDER_MAIL_ID = process.env.SENDER_MAIL_ID; 
        this.SENDER_MAIL_PD = process.env.SENDER_MAIL_PD; 
        this.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY; 
        this.SENDGRID_SENDER = process.env.SENDGRID_SENDER; 
    }

    public createLogger(name: string): bunyan {
        return bunyan.createLogger({ name, level: 'debug' });
    }

    public validateConfig(): void {
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined) {
                throw new Error(`Configuration for ${key} is not set up correctly or is undefined...`);
            }
        }
    }

    public cloudinaryConfig(): void {
        cloudinary.v2.config({
            cloud_name: this.CLOUD_NAME,
            api_key: this.CLOUD_API_KEY,
            api_secret: this.CLOUD_API_SECRET
        });
    }
}

export const config: Config = new Config();
