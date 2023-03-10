import { authRoutes } from '@auth/routes/authRoutes';
import { currentUserRoutes } from '@auth/routes/currentUserRoutes';
import { authMiddleware } from '@globals/helpers/auth-middleware';
import { Application } from 'express';
import { serverAdapter } from './shared/services/queues/base.queue';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
    const routes = () => {
        /* @Queue Routes
         *  Shows jobs queues as UI at this endpoint
         */
        app.use('/queues', serverAdapter.getRouter());

        /* @Auth Routes
         *  Redirects a user to all the Auth related routes
         *  SignIn
         *  SignUp
         *  SignOut
         */
        app.use(BASE_PATH, authRoutes.routes());
        app.use(BASE_PATH, authRoutes.signOutRoutes());

        /* @User Routes
         *  Fetches the current user or the logged in user from the database or redis cache
         */
        app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
    };

    routes();
};
