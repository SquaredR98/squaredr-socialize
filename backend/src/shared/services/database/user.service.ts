import { IUserDocument } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.schema';
import mongoose from 'mongoose';

class UserService {
    public async addUserData(data: IUserDocument): Promise<void> {
        await UserModel.create(data);
    }

    public async getUserByAuthId(userId: string): Promise<IUserDocument> {
        const user: IUserDocument[] = await UserModel.aggregate([
            { $match: {authId: new mongoose.Types.ObjectId(userId) } },
            { $lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId' } },
            { $unwind: '$authId' },
            { $project: this.aggregateProject() }
        ]);
        return user[0];
    }

    private aggregateProject() {
        return {
            _id: 1,
            username: '$authId.usrname',
            uId: '$authId.uId',
            email: '$authId.email',
            avatarColor: '$authId.avatarColor',
            createdAt: '$authId.createdAt',
            postsCount: 1,
            work: 1,
            school: 1,
            quote: 1,
            location: 1,
            blocked: 1,
            blockedBy: 1,
            followersCount: 1,
            followingCount: 1,
            notifications: 1,
            social: 1,
            bgImageVersion: 1,
            bgImageId: 1,
            profilePicture: 1
        };
    }
}

export const userService: UserService = new UserService();
