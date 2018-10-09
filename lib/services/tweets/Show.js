import ServiceBase  from 'chista/ServiceBase';
import X            from 'chista/Exception';
import sequelize    from '../../sequelize';
import { dumpTweet } from '../utils.js';

const Tweet = sequelize.model('Tweet');

export default class TweetsShow extends ServiceBase {
    static validationRules = {
        id : [ 'required', 'object_id' ]
    };

    async execute({ id }) {
        const tweet = await Tweet.findById(id);

        if (!tweet) {
            throw new X({
                code   : 'WRONG_ID',
                fields : {
                    id : 'WRONG_ID'
                }
            });
        }

        return {
            data : dumpTweet(tweet)
        };
    }
}
