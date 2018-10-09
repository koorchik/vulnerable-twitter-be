import ServiceBase  from 'chista/ServiceBase';
import X            from 'chista/Exception';
import { dumpUser } from '../utils';
import sequelize    from '../../sequelize';

const User   = sequelize.model('User');

export default class UsersCreate extends ServiceBase {
    static validationRules = {
        data : [ 'required', { 'nested_object' : {
            email    : [ 'required', 'email', 'to_lc' ],
            password : [ 'required', 'string' ],
            role     : [ 'required', { 'one_of': [ 'ADMIN', 'USER' ] } ]
        } } ]
    };

    async execute({ data }) {
        if (await User.findOne({ where: { email: data.email } })) {
            throw new X({
                code   : 'NOT_UNIQUE',
                fields : {
                    email : 'NOT_UNIQUE'
                }
            });
        }

        const user = await User.create(data);

        return { data: dumpUser(user) };
    }
}
