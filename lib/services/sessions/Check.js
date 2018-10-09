import { promisify } from 'bluebird';
import jwt           from 'jsonwebtoken';
import ServiceBase   from 'chista/ServiceBase';
import X             from 'chista/Exception';
import { secret }    from '../../../etc/config.json';
import sequelize    from '../../sequelize';

const User = sequelize.model('User');

const jwtVerify = promisify(jwt.verify);

export default class SessionsCheck extends ServiceBase {
    static validationRules = {
        token : [ 'required', 'string' ]
    };

    async execute({ token }) {
        try {
            const userData = await jwtVerify(token, secret);

            const isValid  = await User.findOne({ where: { id: userData.id } });

            if (!isValid) {
                throw new Error('NOT_VALID_USER');
            }

            return userData;
        } catch (e) {
            throw new X({
                code   : 'PERMISSION_DENIED',
                fields : {
                    token : 'WRONG_TOKEN'
                }
            });
        }
    }
}
