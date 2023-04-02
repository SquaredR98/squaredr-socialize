import { authMiddleware } from '@globals/helpers/auth-middleware';
import { Create } from '@posts/controllers/create-post';
import express, { Router } from 'express';

class PostRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.post('/post', authMiddleware.checkAuthentication, Create.prototype.post);

        return this.router;
    }
}

export const postRoutes: PostRoutes = new PostRoutes();
