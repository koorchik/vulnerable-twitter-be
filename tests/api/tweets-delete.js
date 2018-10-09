import { assert }  from 'chai';
import supertest   from 'supertest';

import app         from '../../app';
import TestFactory from './TestFactory';

const factory = new TestFactory();
const request = supertest.agent(app);

let token;
let tweetId;

suite('Tweets Delete');

before(async () => {
    await factory.cleanup();
    const users = await factory.setDefaultUsers();
    const tweets = await factory.setDefaultTweets(users[0].id);

    tweetId = tweets[0].dataValues.id;
    token = await factory.login(request);
});

test('Positive: delete tweets', () => {
    return request
        .delete(`/api/v1/tweets/${tweetId}?token=${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.ok(body.status);
        });
});

after(async () => {
    await factory.cleanup();
});
