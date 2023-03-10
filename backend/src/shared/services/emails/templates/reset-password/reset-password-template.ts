import fs from 'fs';
import ejs from 'ejs';
import { IResetPasswordParams } from '@user/interfaces/user.interface';

class ResetPasswordTemplate {
    public resetPasswordTemplate(templateParams: IResetPasswordParams) {
        const { username, email, ipaddress, date} = templateParams;
        return ejs.render(fs.readFileSync(__dirname + '/reset-password-template.ejs', 'utf8'), {
            username,
            email,
            ipaddress,
            date,
            image_url: 'https://icon2.cleanpng.com/20180218/jgq/kisspng-password-computer-security-scalable-vector-graphic-unlocked-lock-cliparts-5a89c26ac29879.2081123815189776427971.jpg'
        });
    }
}

export const resetPasswordTemplate: ResetPasswordTemplate = new ResetPasswordTemplate();
