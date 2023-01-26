import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import { config } from '@root/config';
import { NotAuthorizedError } from '@globals/helpers/error-handler';
import Logger from 'bunyan';
import { AuthPayload } from '@auth/interfaces/auth.interface';

const logger: Logger = config.createLogger('auth-middleware');

export class AuthMiddleWare {
    public verifyUser(req: Request, res: Response, next: NextFunction): void {
        if (!req.session?.jwt) {
            throw new NotAuthorizedError('Unauthenticated: Please Login...');
        }

        try {
            const payload: AuthPayload = JWT.verify(req.session?.jwt, config.JWT_SECRET_KEY as string) as unknown as AuthPayload;
            req.currentUser = payload;
        } catch (error) {
            logger.error(error);
            throw new NotAuthorizedError('Unauthorized: Invalid Token...');
        }
        next();
    }

    public checkAuthentication(req: Request, res: Response, next: NextFunction) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (!req.currentUser!) {
            throw new NotAuthorizedError('Unauthorized: Forbidden Resource...');
        }
        next();
    }
}

export const authMiddleware: AuthMiddleWare = new AuthMiddleWare();
