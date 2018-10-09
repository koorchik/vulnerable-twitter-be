import path                    from 'path';
import moment                  from 'moment';
import fse                     from 'fs-extra';

import sequelize, { mysqlUrl } from '../../lib/sequelize.js';
import { testStaticPath }      from '../../etc/config.json';

const fixturesPath  = 'tests/api/fixtures';
const Tweet         = sequelize.model('Tweet');
const User          = sequelize.model('User');

export default class TestFactory {
    constructor() {
        // Additonal protection against running test on production db
        if (!mysqlUrl.match(/test/i)) {
            throw new Error(`DATABASE URL [${mysqlUrl}] DOES NOT HAVE "test" IN ITS NAME`);
        }
        this.actions = [];
    }

    createUser(data) {
        return User.create(data);
    }

    async login(request) {
        return new Promise((resolve) => {
            request
                .post('/api/v1/sessions')
                .send({ 'data': { email: 'admin1@gmail.com', password: 'password1' } })
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }
                    resolve(res.body.data.jwt);
                });
        });
    }

    async loginAsAdmin(request) {
        return new Promise((resolve) => {
            request
                .post('/api/v1/sessions')
                .send({ 'data': { email: 'admin3@gmail.com', password: 'password3' } })
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }
                    resolve(res.body.data.jwt);
                });
        });
    }

    async setDefaultUsers() {
        const users = [
            {
                email    : 'admin1@gmail.com',
                password : 'password1',
                status   : 'ACTIVE',
                role     : 'USER'
            },
            {
                email    : 'admin2@gmail.com',
                password : 'password2',
                status   : 'BLOCKED',
                role     : 'USER'
            },
            {
                email    : 'admin3@gmail.com',
                password : 'password3',
                status   : 'ACTIVE',
                role     : 'ADMIN'
            }
        ];
        const promises = users.map(userData => User.create(userData));

        return Promise.all(promises);
    }

    async setDefaultTweets(userId) {
        const tweets = [
            {
                title     : 'Title',
                subtitle  : 'Subtitle',
                text      : 'Text',
                createdAt : Date.now() - 1000,
                role      : 'USER',
                userId
            },
            {
                title     : 'Title2',
                subtitle  : 'Subtitle2',
                text      : 'Text2',
                role      : 'USER',
                createdAt : Date.now() - 2000,
                userId
            },
            {
                title     : 'Title3',
                subtitle  : 'Subtitle3',
                text      : 'Text3',
                role      : 'USER',
                createdAt : Date.now() - 3000,
                userId
            }
        ];

        const promises = tweets.map(tweet => Tweet.create(tweet));

        await Promise.all(promises);

        const createdTweets = await Tweet.findAll({ order: [ [ 'createdAt', 'DESC' ] ] });

        return createdTweets;
    }

    async cleanup() {
        await this._dropDatabase();
        // sequelize.close();
    }

    validateDate(data) {
        return moment(data).isValid();
    }

    validateObjectId() {
        return true;
    }

    createStaticFolder() {
        return fse.mkdirs(testStaticPath);
    }

    removeStaticFolder() {
        return fse.remove(testStaticPath);
    }

    createFixture(name, size) {
        const target = path.join(fixturesPath, name);

        return fse.writeFile(target, Buffer.alloc(size));
    }

    removeFixture(name) {
        const target = path.join(fixturesPath, name);

        return fse.remove(target);
    }

    async _dropDatabase() {
        await sequelize.models.Tweet.destroy({ where: {} });
        await sequelize.models.Action.destroy({ where: {} });
        await sequelize.models.User.destroy({ where: {} });
    }
}
