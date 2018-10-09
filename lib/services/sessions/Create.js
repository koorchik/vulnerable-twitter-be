import jwt          from 'jsonwebtoken';
import ServiceBase  from 'chista/ServiceBase';
import X            from 'chista/Exception';
import sequelize    from '../../sequelize';
import { dumpUser } from '../utils';

import { secret }   from '../../../etc/config.json';

const User = sequelize.model('User');

export default class SessionsCreate extends ServiceBase {
    static validationRules = {
        data : [ 'required', { 'nested_object' : {
            password : [ 'required', 'string' ],
            email    : [ 'required', 'email' ]
        } } ]
    };

    async execute({ data }) {
        const existingUser = await User.findOne({ where: { email: data.email } });

        if (!existingUser || !await existingUser.checkPassword(data.password)) {
            throw new X({
                code   : 'AUTHENTICATION_FAILED',
                fields : {
                    email    : 'INVALID',
                    password : 'INVALID'
                }
            });
        }

        if (existingUser.status === 'BLOCKED') {
            throw new X({
                code   : 'NOT_ACTIVE_USER',
                fields : {
                    status : 'NOT_ACTIVE_USER'
                }
            });
        }

        return {
            data : {
                jwt : jwt.sign(dumpUser(existingUser), secret)
            }
        };
    }
}
