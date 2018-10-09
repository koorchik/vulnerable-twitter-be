'use strict';

module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.createTable('Actions', {
            id        : { type: Sequelize.STRING, allowNull: false, primaryKey: true },
            type      : { type: Sequelize.ENUM('confirmEmail', 'resetPassword', 'resetPasswordBySMS'), allowNull: false },
            data      : { type: Sequelize.JSON, allowNull: false },
            createdAt : { type: Sequelize.DATE, allowNull: false },
            updatedAt : { type: Sequelize.DATE, allowNull: false }
        });
    },

    down : (queryInterface) => {
        return queryInterface.dropTable('Actions');
    }
};