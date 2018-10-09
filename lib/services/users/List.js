import ServiceBase from 'chista/ServiceBase';
import sequelize from '../../sequelize';
import {
    dumpUser
} from '../utils.js';


const User = sequelize.model('User');
const Tweet = sequelize.model('Tweet');

export default class UsersList extends ServiceBase {
    static validationRules = {
        firstName  : [ { 'min_length': 2 } ],
        secondName : [ { 'min_length': 2 } ],
        email      : [ 'string' ],
        search     : [ { 'min_length': 2 } ],
        include    : [ { 'list_of': 'string' } ],
        limit      : [ 'positive_integer' ],
        offset     : [ 'integer', { 'min_number': 0 } ],
        sort       : [ { 'one_of': [ 'id', 'firstName', 'secondName', 'email' ] } ],
        order      : [ { 'one_of': [ 'ASC', 'DESC' ] } ]
    };

    includeMap = {
        tweets : {
            model : Tweet,
            as    : 'tweets',
            on    : {
                '$User.id$' : {
                    $col : 'tweets.userId'
                }
            },
            order : [ { model: Tweet, as: 'tweets' }, 'createdAt', 'DESC' ]
        }
    };

    dbRequest = {}

    async execute({ limit = 100, offset = 0, search, email }) {
        const { Op } = sequelize;
        const userFields = [ 'firstName', 'secondName', 'email' ];
        const findQuery = search
            ? { [Op.or]: userFields.map(field => ({ [field]: { [Op.regexp]: search } })) }
            : {};

        if (email) {
            findQuery.email = email;
        }

        console.log(findQuery);

        this.dbRequest = {
            where : findQuery,
            order : [ [ 'createdAt', 'DESC' ] ],
            limit,
            offset
        };

        const [ users, filteredCount, totalCount ] = await Promise.all([
            User.findAll(this.dbRequest),
            User.count({ where: findQuery }),
            User.count()
        ]);

        const data = users.map(dumpUser);

        return {
            data,
            meta : {
                totalCount,
                filteredCount,
                limit,
                offset
            }
        };
    }
}
