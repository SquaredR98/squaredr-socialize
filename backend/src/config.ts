import dotEnv from 'dotenv';
import bunyan from 'bunyan';

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

  // FRONTEND URL
  public CLIENT_URL: string | undefined;

  // REDIS
  public REDIS_HOST: string | undefined;

  private readonly DEFAULT_DATABASE_URL = 'mongodb://localhost:27027/test';

  constructor () {
    this.NODE_ENV = process.env.NODE_ENV;

    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
    this.DATABASE_USR = process.env.DATABASE_USR || '';
    this.DATABASE_PAS = process.env.DATABASE_PAS || '';


    this.SECRET_ONE = process.env.SECRET_ONE || '0123456789';
    this.SECRET_TWO = process.env.SECRET_TWO || '9876543210';


    this.CLIENT_URL = process.env.DATABASE_URI || '';

    this.REDIS_HOST = process.env.REDIS_HOST;
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug'});
  }

  public validateConfig() : void {
    for(const [key, value] of Object.entries(this)) {
      if(value === undefined) {
        throw new Error(`Configuration for ${key} is not set up correctly or is undefined...`);
      }
    }
  }
};

export const config: Config = new Config();