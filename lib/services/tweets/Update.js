import ServiceBase  from 'chista/ServiceBase';
import sequelize    from '../../sequelize';
import { dumpTweet } from '../utils.js';

const Tweet = sequelize.model('Tweet');

export default class TweetsUpdate extends ServiceBase {
    static validationRules = {
        id   : [ 'required' ],
        data : [ 'required', { 'nested_object' : {
            title       : [ 'not_empty', 'string' ],
            subtitle    : [ 'not_empty', 'string' ],
            image       : [ 'url' ],
            text        : [ 'not_empty', 'string' ],
            isPublished : [ 'not_empty', 'integer', { 'one_of': [ 1, 0 ] } ]
        } } ]
    };

    async execute(data) {
        let tweet = await Tweet.findById(data.id);

        tweet = await this._updateTweet(tweet, data.data);

        return {
            data : dumpTweet(tweet)
        };
    }

    async _updateTweet(tweet, data) {
        const tweetForUpdate = tweet;

        Object.keys(data).forEach(key => {
            tweetForUpdate[key] = data[key];
        });

        await tweetForUpdate.save();

        return tweetForUpdate;
    }
}
