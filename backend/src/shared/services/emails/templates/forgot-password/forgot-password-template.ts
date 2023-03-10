import fs from 'fs';
import ejs from 'ejs';

class ForgotPasswordTemplate {
    public forgotPasswordTemplate(username: string, resetLink: string): string {
        return ejs.render(fs.readFileSync(__dirname + '/forgot-password-template.ejs', 'utf8'), {
            username,
            resetLink,
            image_url: 'https://icon2.cleanpng.com/20180218/jgq/kisspng-password-computer-security-scalable-vector-graphic-unlocked-lock-cliparts-5a89c26ac29879.2081123815189776427971.jpg'
        });
    }
}

export const forgotPasswordTemplate: ForgotPasswordTemplate = new ForgotPasswordTemplate();
