import { BaseCache } from '@services/redis/base.cache';
import Logger from 'bunyan';
import { config } from '@root/config';
import { ServerError } from '@globals/helpers/error-handler';
import { ISavePostToCache } from '@posts/interfaces/post.interfaces';

const logger: Logger = config.createLogger('postCache');

export class PostCache extends BaseCache {
    constructor() {
        super('postsCache');
    }

    public async savePostToCache(data: ISavePostToCache): Promise<void> {
        const { key, currentUserId, uId, createdPost } = data;

        const {
            _id,
            userId,
            username,
            email,
            avatarColor,
            profilePicture,
            post,
            bgColor,
            feelings,
            privacy,
            gifUrl,
            commentsCount,
            imgVersion,
            imgId,
            reactions,
            createdAt
        } = createdPost;

        const firstList: string[] = [
            '_id',
            `${_id}`,
            'userId',
            `${userId}`,
            'username',
            `${username}`,
            'email',
            `${email}`,
            'avatarColor',
            `${avatarColor}`,
            'profilePicture',
            `${profilePicture}`,
            'post',
            `${post}`,
            'bgColor',
            `${bgColor}`,
            'feelings',
            `${feelings}`,
            'privacy',
            `${privacy}`,
            'gifUrl',
            `${gifUrl}`
        ];

        const secondLine: string[] = [
            'commentsCount',
            `${commentsCount}`,
            'reactions',
            JSON.stringify(reactions),
            'imgVersion',
            `${imgVersion}`,
            'imgId',
            `${imgId}`,
            'createdAt',
            `${createdAt}`
        ];

        const dataToSave: string[] = [...firstList, ...secondLine];

        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }

            const postCount: string[] = await this.client.HMGET(`users:${currentUserId}`, 'postCOunt');
            const multi: ReturnType<typeof this.client.multi> = this.client.multi();
            multi.ZADD('post', { score: parseInt(uId, 10), value: `${key}` });
            multi.HSET(`posts:${key}`, dataToSave);
            const count: number = parseInt(postCount[0], 10) + 1;
            multi.HSET(`users:${currentUserId}`, ['postCount', count]);
            multi.exec();
        } catch (error) {
            logger.error('error');
            throw new ServerError('Server Error. Try Again...');
        }
    }
}
