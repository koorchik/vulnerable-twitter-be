import ServiceBase  from 'chista/ServiceBase';
import sequelize    from '../../sequelize';
import { dumpTweet } from '../utils.js';

const Tweet = sequelize.model('Tweet');

export default class TweetsCreate extends ServiceBase {
    static validationRules = {
        data : [ 'required', { 'nested_object' : {
            title       : [ 'required', 'string' ],
            subtitle    : [ 'required', 'string' ],
            image       : [ 'not_empty', 'url' ],
            text        : [ 'required', 'string' ],
            isPublished : [ 'integer', { 'one_of': [ 1, 0 ] } ]
        } } ]
    };

    async execute(data) {
        const userId = this.context.userId;
        const tweet = await Tweet.create({ ...data.data, userId });

        return {
            data : dumpTweet(tweet)
        };
    }
}
