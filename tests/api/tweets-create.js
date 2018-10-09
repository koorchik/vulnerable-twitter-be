import { assert }  from 'chai';
import supertest   from 'supertest';
import jwt         from 'jsonwebtoken';

import app             from '../../app';
import config          from '../../etc/config.json';
import TestFactory     from './TestFactory';

const factory = new TestFactory();
const request = supertest.agent(app);
const secret = config.secret;

let token;
let userId;

suite('Tweets Create');

before(async () => {
    await factory.cleanup();
    await factory.setDefaultUsers();

    token = await factory.login(request);

    jwt.verify(token, secret, (err, decoded) => {
        if (err) throw err;

        userId = decoded.id;
    });
});

test('Positive: create tweets', () => {
    return request
        .post(`/api/v1/tweets?token=${token}`)
        .send({ data : {
            title    : 'Title',
            subtitle : 'Subtitle',
            text     : 'Text'
        } })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.ok(body.status);

            const { data } = body;
            const { createdAt, id } = data;

            assert.ok(factory.validateDate(createdAt));
            assert.ok(factory.validateObjectId(id));

            delete data.createdAt;
            delete data.updatedAt;
            delete data.id;

            assert.deepEqual(data, {
                title       : 'Title',
                subtitle    : 'Subtitle',
                text        : 'Text',
                image       : '',
                isPublished : false,
                userId,
                links       : { authors: [ { type: 'User', id: userId } ] }
            });
        });
});

after(async () => {
    await factory.cleanup();
});
