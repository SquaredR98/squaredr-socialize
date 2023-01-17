import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { Helpers } from '@globals/helpers/helpers';
import { AuthModel } from '@auth/models/auth.schema';

class AuthService {
    public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
        const query = {
            $or: [{ username: Helpers.firstLetterUpperCase(username), email: Helpers.lowerCase(email)}]
        };

        const user: IAuthDocument = await AuthModel.findOne(query).exec() as IAuthDocument;
        return user;
    }
}

export const authService: AuthService = new AuthService();
