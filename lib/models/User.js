import { DataTypes } from 'sequelize';
import { injectMethods, passwordMethods, generateObjectId } from './utils';

import Base from './Base';
import Tweet from './Tweet';

class User extends Base {
    static schema = {
        id           : { type: DataTypes.STRING, defaultValue: generateObjectId, primaryKey: true },
        email        : { type: DataTypes.STRING, allowNull: false, unique: true },
        status       : { type: DataTypes.ENUM('ACTIVE', 'BLOCKED', 'PENDING'), defaultValue: 'PENDING' },
        role         : { type: DataTypes.ENUM('ADMIN', 'USER') },
        firstName    : { type: DataTypes.STRING, defaultValue: '' },
        secondName   : { type: DataTypes.STRING, defaultValue: '' },
        passwordHash : { type: DataTypes.STRING },
        password     : { type : DataTypes.VIRTUAL,
            set(password) {
                this.setDataValue('passwordHash', this.encryptPassword(password));
            } }
    };

    static initRelations() {
        this.hasMany(Tweet, { foreignKey: 'userId', as: 'tweets' });
    }
}

injectMethods(User, passwordMethods);


export default User;
