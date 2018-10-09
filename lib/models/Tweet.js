import { DataTypes } from 'sequelize';
import { generateObjectId } from './utils';

import Base from './Base';
import User from './User';

class Tweet extends Base {
    static schema = {
        id          : { type: DataTypes.STRING, defaultValue: generateObjectId, primaryKey: true },
        userId      : { type: DataTypes.STRING, allowNull: false, references: { model: 'User', key: 'id' } },
        title       : { type: DataTypes.STRING, allowNull: false },
        subtitle    : { type: DataTypes.STRING, allowNull: false },
        text        : { type: DataTypes.STRING, allowNull: false },
        image       : { type: DataTypes.STRING, defaultValue: '' },
        isPublished : { type: DataTypes.BOOLEAN, defaultValue: false }
    };

    static initRelations() {
        this.belongsTo(User, { foreignKey: 'id', as: 'authors' });
    }
}

export default Tweet;
