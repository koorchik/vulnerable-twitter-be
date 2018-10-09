import jwt          from 'jsonwebtoken';
import ServiceBase  from 'chista/ServiceBase';
import X            from 'chista/Exception';

import { dumpUser } from '../utils';
import sequelize    from '../../sequelize';
import { secret }   from '../../../etc/config.json';

const Action = sequelize.model('Action');

export default class ActionsSubmit extends ServiceBase {
    async validate(data) {
        const action = await Action.findById(data.id);

        if (!action) {
            throw new X({
                code   : 'WRONG_ID',
                fields : {
                    id : 'WRONG_ID'
                }
            });
        }

        const rulesRegistry = {
            resetPassword : {
                password        : 'required',
                confirmPassword : [ 'required', { 'equal_to_field': [ 'password' ] } ]
            },
            confirmEmail       : {},
            resetPasswordBySMS : {
                password        : 'required',
                confirmPassword : [ 'required', { 'equal_to_field': [ 'password' ] } ],
                code            : 'required'
            }
        };

        return this.doValidation(data, {
            ...rulesRegistry[action.type],
            id : [ 'required', 'object_id' ]
        });
    }

    async execute(data) {
        const action = await Action.findById(data.id);
        const { type } = action;
        const result = await action.run(data);

        await action.destroy();

        /* istanbul ignore else */
        if (type === 'resetPassword') {
            return { data: dumpUser(result) };
        } else if (type === 'confirmEmail') {
            return { jwt: jwt.sign(action, secret) };
        }

        return {};
    }
}

