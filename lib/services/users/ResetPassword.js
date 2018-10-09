import ServiceBase from 'chista/ServiceBase';
import X           from 'chista/Exception';
import emailSender from '../emailSender';
import sequelize    from '../../sequelize';

const User = sequelize.model('User');
const Action = sequelize.model('Action');

export default class UsersResetPassword extends ServiceBase {
    static validationRules = {
        data : { 'nested_object' : {
            email : [ 'required', 'email' ]
        } }
    };

    async execute({ data }) {
        const user = await User.findOne({ where: { email: data.email } });

        if (!user) {
            throw new X({
                code   : 'NOT_FOUND',
                fields : {
                    email : 'NOT_FOUND'
                }
            });
        }

        // const { id : userId, email, status : userStatus } = user;

        if (user.status === 'BLOCKED') {
            throw new X({
                code   : 'BLOCKED_USER',
                fields : {
                    email : 'BLOCKED_USER'
                }
            });
        }

        const actionData = {
            type : 'resetPassword',
            data : {
                userId : user.id,
                email  : user.email
            }
        };

        const action = await Action.create(actionData);

        emailSender.send('resetPassword', user.email, { ...user, actionId: action.id });

        return {};
    }
}
