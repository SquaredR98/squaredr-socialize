/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import { config } from '@root/config';
import { joiValidation } from '@globals/decorators/joi-validation.decorators';
import HTTP_STATUS from 'http-status-codes';
import { authService } from '@services/database/auth.service';
import { BadRequestError } from '@globals/helpers/error-handler';
import { loginSchema } from '@auth/schemes/signin';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { IUserDocument } from '../../user/interfaces/user.interface';
import { userService } from '@services/database/user.service';

export class SignIn {
    @joiValidation(loginSchema)
    public async read(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;
        const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);

        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }

        const passwordMatch: boolean = await existingUser.comparePassword(password);
        if (!passwordMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);

        const userJwt: string = JWT.sign(
            {
                userId: user._id,
                uId: existingUser.uId,
                email: existingUser.email,
                username: existingUser.username,
                avatarColor: existingUser.avatarColor
            },
            config.JWT_SECRET_KEY!
        );
        const userDocument: IUserDocument = {
            ...user,
            authId: existingUser!._id,
            username: existingUser!.username,
            email: existingUser!.email,
            avatarColor: existingUser!.avatarColor,
            uId: existingUser!.uId,
            createdAt: existingUser!.createdAt
        } as IUserDocument;
        req.session = { jwt: userJwt };
        res.status(HTTP_STATUS.OK).json({ message: 'User Login Successfully', user: userDocument, token: userJwt });
    }
}
