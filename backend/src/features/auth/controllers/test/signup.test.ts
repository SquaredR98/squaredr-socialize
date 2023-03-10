/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import * as cloudinaryUploads from '@globals/helpers/cloudinary-upload';
import { SignUp } from '@auth/controllers/signup';
import { CustomError } from '@globals/helpers/error-handler';
import { mockAuthRequest, mockAuthResponse, authMock } from '@root/mocks/auth.mock';
import { authService } from '@services/database/auth.service';
import { UserCache } from '@services/redis/user.cache';

jest.mock('@services/queues/base.queue');
jest.mock('@services/redis/user.cache');
jest.mock('@services/queues/user.queue');
jest.mock('@services/queues/auth.queue');
jest.mock('@globals/helpers/cloudinary-upload');

describe('SignUp', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if username is not available', () => {
        const req: Request = mockAuthRequest({}, {
            username: '',
            email: 'ravi.r@antino.io',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ==',
            password: 'password'
        }) as unknown as Request;
        const res: Response = mockAuthResponse();

        SignUp.prototype.create(req, res).catch((err: CustomError) => {
            expect(err.statusCode).toEqual(400);
            expect(err.serializeErrors().message).toEqual('Username is a required field');
        });
    });
    it('should throw an error if username length is less than minimum', () => {
        const req: Request = mockAuthRequest({}, {
            username: 'ravi',
            email: 'ravi.r@antino.io',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ==',
            password: 'password'
        }) as unknown as Request;
        const res: Response = mockAuthResponse();

        SignUp.prototype.create(req, res).catch((err: CustomError) => {
            expect(err.statusCode).toEqual(400);
            expect(err.serializeErrors().message).toEqual('Invalid Username');
        });
    });
    it('should throw an error if username length is greater than maximum', () => {
        const req: Request = mockAuthRequest({}, {
            username: 'raviranjan',
            email: 'ravi.r@antino.io',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ==',
            password: 'password'
        }) as unknown as Request;
        const res: Response = mockAuthResponse();

        SignUp.prototype.create(req, res).catch((err: CustomError) => {
            expect(err.statusCode).toEqual(400);
            expect(err.serializeErrors().message).toEqual('Invalid username');
        });
    });
    it('should throw an error if email is not valid', () => {
        const req: Request = mockAuthRequest({}, {
            username: 'ravi',
            email: 'ravi.r$antino@io',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ==',
            password: 'password'
        }) as unknown as Request;
        const res: Response = mockAuthResponse();

        SignUp.prototype.create(req, res).catch((err: CustomError) => {
            expect(err.statusCode).toEqual(400);
            expect(err.serializeErrors().message).toEqual('Email must be valid');
        });
    });
    it('should throw an error if email is empty', () => {
        const req: Request = mockAuthRequest({}, {
            username: 'raviranj',
            email: '',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ==',
            password: 'password'
        }) as unknown as Request;
        const res: Response = mockAuthResponse();

        SignUp.prototype.create(req, res).catch((err: CustomError) => {
            expect(err.statusCode).toEqual(400);
            expect(err.serializeErrors().message).toEqual('Email is a required field');
        });
    });
    it('should throw an error if password length is less than minimum', () => {
        const req: Request = mockAuthRequest({}, {
            username: 'ravi',
            email: 'ravi.r$antino@io',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ==',
            password: 'pas'
        }) as unknown as Request;
        const res: Response = mockAuthResponse();

        SignUp.prototype.create(req, res).catch((err: CustomError) => {
            expect(err.statusCode).toEqual(400);
            expect(err.serializeErrors().message).toEqual('Invalid password');
        });
    });
    it('should throw an error if password length is more than maximum', () => {
        const req: Request = mockAuthRequest({}, {
            username: 'ravi',
            email: 'ravi.r$antino@io',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ==',
            password: 'pas'
        }) as unknown as Request;
        const res: Response = mockAuthResponse();

        SignUp.prototype.create(req, res).catch((err: CustomError) => {
            expect(err.statusCode).toEqual(400);
            expect(err.serializeErrors().message).toEqual('Invalid password');
        });
    });
    it('should throw an error if password is empty', () => {
        const req: Request = mockAuthRequest({}, {
            username: 'raviranj',
            email: 'ravi@antino.io',
            avatarColor: 'red',
            avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ==',
            password: 'password'
        }) as unknown as Request;
        const res: Response = mockAuthResponse();

        SignUp.prototype.create(req, res).catch((err: CustomError) => {
            expect(err.statusCode).toEqual(400);
            expect(err.serializeErrors().message).toEqual('Password is a required field');
        });
    });

    it('should throw unauthorized error if user already exist', () => {
        const req: Request = mockAuthRequest({}, {
            username: 'Manny',
            email: 'manny@me.com',
            avatarColor: '#9c27b0',
            avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ==',
            password: 'qwerty1',
        }) as unknown as Request;

        const res: Response = mockAuthResponse();

        jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(authMock);
        SignUp.prototype.create(req, res).catch((err: CustomError) => {
            expect(err.statusCode).toEqual(400);
            expect(err.serializeErrors().message).toEqual('User already exists');
        });
    });

    it('should should set session data for valid credentials and send correct json response', async () => {
        const req: Request = mockAuthRequest({}, {
            username: 'Manny',
            email: 'manny@me.com',
            avatarColor: '#9c27b0',
            avatarImage: 'data:text/plain;base64,SVGsbG8sIFdvcmxkIQ==',
            password: 'qwerty1',
        }) as unknown as Request;

        const res: Response = mockAuthResponse();

        jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(null as any);
        const userSpy = jest.spyOn(UserCache.prototype, 'saveUserToCache');
        jest.spyOn(cloudinaryUploads, 'upload').mockImplementation((): any => Promise.resolve({
            version: 'dskjfnlds',
            public_id: '0w8h4fsnihf93ufinskejf'
        }));
        await SignUp.prototype.create(req, res);
        expect(req.session?.jwt).toBeDefined();
        expect(res.json).toHaveBeenCalledWith({
            message: 'User Created Successfully',
            user: userSpy.mock.calls[0][2],
            token: req.session?.jwt
        });
    });
});
