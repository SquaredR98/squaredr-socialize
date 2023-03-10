// Library or Node Modules
import { Request, Response } from 'express';
import crypto from 'crypto';
import HTTP_STATUS from 'http-status-codes';
import moment from 'moment';
import publicIP from 'ip';


// Custom Modules
import { emailSchema, passwordSchema } from '@auth/schemes/password';
import { joiValidation } from '@globals/decorators/joi-validation.decorators';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { authService } from '@services/database/auth.service';
import { BadRequestError } from '@globals/helpers/error-handler';
import { config } from '@root/config';
import { forgotPasswordTemplate } from '@services/emails/templates/forgot-password/forgot-password-template';
import { emailQueue } from '@services/queues/email.queue';
import { IResetPasswordParams } from '@user/interfaces/user.interface';
import { resetPasswordTemplate } from '@services/emails/templates/reset-password/reset-password-template';

export class Password {
    @joiValidation(emailSchema)
    public async create(req: Request, res: Response) {
        const { email } = req.body;

        const existingUser: IAuthDocument = await authService.getAuthUserByEmail(email);

        if(!existingUser) {
            throw new BadRequestError('Invalid Credentials');
        }

        const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
        const randomChars: string = randomBytes.toString('hex');

        await authService.updatePasswordToken(`${existingUser._id}`, randomChars, Date.now() * 60 * 1000);

        const resetLink = `${config.CLIENT_URL}/reset-password-token=${randomChars}`;
        const template: string = forgotPasswordTemplate.forgotPasswordTemplate(existingUser.username, resetLink);
        emailQueue.addEmailJobToQueue('forgotPasswordEmail', { template, receiverEmail: email, subject: 'Reset Your Password' });
        res.status(HTTP_STATUS.OK).json({ message: 'Password reset email sent...'});
    }

    @joiValidation(passwordSchema)
    public async update(req: Request, res: Response) {
        const { password, confirmPassword } = req.body;
        const { token } = req.params;

        if(password !== confirmPassword) {
            throw new BadRequestError('Passwords do not match');
        }

        const existingUser: IAuthDocument = await authService.getAuthUserByPasswordToken(token);

        if(!existingUser) {
            throw new BadRequestError('Reset token has expired');
        }

        existingUser.password = password;
        existingUser.passwordResetExpires = undefined;
        existingUser.passwordResetToken = undefined;

        await existingUser.save();

        const templateParams: IResetPasswordParams = {
            username: existingUser.username,
            email: existingUser.email,
            ipaddress: publicIP.address(),
            date: moment().format('DD/MM/YYYY HH:mm:ss')
        };

        const template: string = resetPasswordTemplate.resetPasswordTemplate(templateParams);
        emailQueue.addEmailJobToQueue('forgotPasswordEmail', { template, receiverEmail: existingUser.email, subject: 'Password Reset Confirmation...' });
        res.status(HTTP_STATUS.OK).json({ message: 'Pasword updated successfully...'});
    }
}
