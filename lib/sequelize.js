import Sequelize from 'sequelize';
import config    from '../etc/db.json';

import User   from './models/User';
import Tweet   from './models/Tweet';
import Action from './models/Action';

/* istanbul ignore next */
const { database, username, password, dialect, host, port } = config[process.env.MODE || 'development'];

const sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect,
    logging : false
});

const models = [
    User,
    Tweet,
    Action
];

models.forEach(model => model.init(sequelize));
models.forEach(model => model.initRelationsAndHooks(sequelize));

export const mysqlUrl = `mysql://${host}:${port}/${(database)}`;

export default sequelize;
