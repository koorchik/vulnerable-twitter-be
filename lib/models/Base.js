import Sequelize from 'sequelize';

class Base extends Sequelize.Model {
    static init(sequelize) {
        super.init(this.schema, { sequelize });
    }

    static initRelationsAndHooks() {
        if (this.initRelations) this.initRelations();
        if (this.initHooks) this.initHooks();
    }
}

export default Base;
