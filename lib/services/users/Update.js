import ServiceBase  from 'chista/ServiceBase';
import X            from 'chista/Exception';
import sequelize    from '../../sequelize';
import { dumpUser } from '../utils';

const User = sequelize.model('User');

export default class UsersUpdate extends ServiceBase {
    static validationRules = {
        id   : [ 'required', 'object_id' ],
        data : { 'nested_object' : {
            language    : { 'one_of': [ 'en', 'ru', 'ua' ] },
            companyName : [ { 'min_length': 2 }, { 'max_length': 50 } ],
            firstName   : [ { 'min_length': 2 }, { 'max_length': 50 } ],
            secondName  : [ { 'min_length': 2 }, { 'max_length': 50 } ],
            position    : [ { 'min_length': 2 }, { 'max_length': 50 } ]
        } }
    };

    async execute({ id, data }) {
        const { firstName, secondName } = data;
        const user = await User.findById(id);

        if (id !== this.context.userId) {
            throw new X({
                code   : 'WRONG_ID',
                fields : {
                    id : 'WRONG_ID'
                }
            });
        }
        const updatedUser = await user.update({ firstName, secondName });

        return dumpUser(updatedUser);
    }
}
