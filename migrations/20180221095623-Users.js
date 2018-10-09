'use strict';

module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            id           : { type: Sequelize.STRING, allowNull: false, primaryKey: true },
            email        : { type: Sequelize.STRING, allowNull: false, unique: true },
            status       : { type: Sequelize.ENUM('ACTIVE', 'BLOCKED', 'PENDING'), defaultValue: 'PENDING' },
            role         : { type: Sequelize.ENUM('ADMIN', 'USER') },
            firstName    : { type: Sequelize.STRING, defaultValue: '' },
            secondName   : { type: Sequelize.STRING, defaultValue: '' },
            createdAt    : { type: Sequelize.DATE, allowNull: false },
            updatedAt    : { type: Sequelize.DATE, allowNull: false },
            passwordHash : { type: Sequelize.STRING }
        });
    },

    down : (queryInterface) => {
        return queryInterface.dropTable('Users');
    }
};
