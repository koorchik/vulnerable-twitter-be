import ServiceBase  from 'chista/ServiceBase';
import X            from 'chista/Exception';
import { dumpUser } from '../utils';
import sequelize    from '../../sequelize';

const User = sequelize.model('User');

export default class UsersList extends ServiceBase {
    static validationRules = {
        id : [ 'required', 'object_id' ]
    };

    async execute({ id }) {
        const user = await User.findById(id);

        if (!user) {
            throw new X({
                code   : 'WRONG_ID',
                fields : {
                    id : 'WRONG_ID'
                }
            });
        }

        return { data: dumpUser(user) };
    }
}
