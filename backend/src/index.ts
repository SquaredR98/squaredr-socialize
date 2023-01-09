import express, {Express} from 'express';
import { SquaredRSocializeApp } from './setupServer';
import databaseConnection from './setupDatabase';
import { config } from './config';

class Application {
  public initializeApp(): void {
    this.loadConfig();
    databaseConnection();                         // Connect database before connecting server.
    const app: Express = express();
    const server: SquaredRSocializeApp = new SquaredRSocializeApp(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.initializeApp();