import { DataTypes as DT }  from 'sequelize';
import X                    from 'chista/Exception';
import { generateObjectId } from './utils';

import Base from './Base';
import User from './User';

class Action extends Base {
    static schema = {
        id   : { type: DT.STRING, defaultValue: generateObjectId, primaryKey: true },
        type : { type: DT.ENUM('confirmEmail', 'resetPassword', 'resetPasswordBySMS'), allowNull: false },
        data : { type: DT.JSON, allowNull: false, defaultValue: {} }
    };

    static initHooks() {
        this.afterCreate(action => {
            process.env.LAST_ACTION_ID = action.dataValues.id; // For testing
        });
    }

    run(data) {
        return this[this.type](data);
    }

    /* istanbul ignore next */
    async confirmEmail({ id }) {
        const user = await User.findById(id);

        return user.update({ status: 'ACTIVE' });
    }

    async resetPassword({ password }) {
        const user = await User.findById(this.data.userId);

        return user.update({ password });
    }

    async resetPasswordBySMS({ password, code }) {
        if (this.data.code !== code) {
            throw new X({
                fields : {
                    code : 'WRONG_CODE'
                },
                code : 'WRONG_CODE'
            });
        }


        const user = await User.findById(this.data.userId);

        return user.update({ password });
    }
}


export default Action;
