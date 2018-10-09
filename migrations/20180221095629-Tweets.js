'use strict';

module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.createTable('Tweets', {
            id     : { type: Sequelize.STRING, allowNull: false, primaryKey: true },
            userId : {
                type       : Sequelize.STRING,
                allowNull  : false,
                references : { model: 'Users', key: 'id' }
            },
            title       : { type: Sequelize.STRING, allowNull: false },
            subtitle    : { type: Sequelize.STRING, allowNull: false },
            text        : { type: Sequelize.STRING, allowNull: false },
            image       : { type: Sequelize.STRING, defaultValue: '' },
            isPublished : { type: Sequelize.BOOLEAN, defaultValue: false },
            createdAt   : { type: Sequelize.DATE, allowNull: false },
            updatedAt   : { type: Sequelize.DATE, allowNull: false }
        });
    },

    down : (queryInterface) => {
        return queryInterface.dropTable('Tweets');
    }
};
