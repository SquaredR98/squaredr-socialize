import express, {Express} from 'express';
import { SquaredRSocializeApp } from '@root/setupServer';
import databaseConnection from '@root/setupDatabase';
import { config } from '@root/config';

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
