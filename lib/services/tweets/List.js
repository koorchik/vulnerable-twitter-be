import Includes  from '../../Includes.js';
import sequelize from '../../sequelize';
import {
    dumpTweet,
    dumpUser,
    getLinked
} from '../utils.js';

const { Op } = sequelize;

const Tweet = sequelize.model('Tweet');
const User = sequelize.model('User');

export default class TweetsList extends Includes {
    static validationRules = {
        limit   : [ 'positive_integer' ],
        offset  : [ 'positive_integer' ],
        search  : [ 'string' ],
        include : [ { 'list_of': 'string' } ],
        sort    : [ { 'one_of': [ 'id', 'createdAt' ] } ],
        order   : [ { 'one_of': [ 'ASC', 'DESC' ] } ]
    };

    includeMap = {
        authors : {
            model : User,
            as    : 'authors',
            on    : {
                '$Tweets.userId$' : {
                    $col : 'authors.id'
                }
            },
            order : [ { model: User, as: 'authors' }, 'createdAt', 'DESC' ]
        }
    };

    dbRequest = {};
    contextNotRequired = true;

    async execute({ limit = 100, offset = 0, search, include }) {
        const tweetFields = [ 'title', 'subtitle' ];
        const findQuery = search
            ? { [Op.or]: tweetFields.map(field => ({ [field]: { [Op.regexp]: search } })) }
            : {};
        const dbRequest = {
            where : findQuery,
            limit,
            offset
        };

        this.dbRequest = {
            where : findQuery,
            order : [ [ 'createdAt', 'DESC' ] ],
            limit,
            offset
        };

        this.setDbIncludes(include);

        const [ tweet, filteredCount, totalCount ] = await Promise.all([
            Tweet.findAll(dbRequest),
            Tweet.count({ where: findQuery }),
            Tweet.count()
        ]);

        const data = tweet.map(dumpTweet);
        const linkedQuery = { order: [ [ 'createdAt', 'DESC' ] ] };
        const linked = await getLinked(data, include, linkedQuery, this.includeMap, {
            authors : dumpUser
        });

        return {
            data,
            linked,
            meta : {
                totalCount,
                filteredCount,
                limit,
                offset
            }
        };
    }
}
