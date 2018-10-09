import { assert }  from 'chai';
import supertest   from 'supertest';
import app         from '../../app';
import TestFactory from './TestFactory';

const factory = new TestFactory();
const request = supertest.agent(app);

let token;
let tweetId;
let userId;

suite('Tweets Update');

before(async () => {
    await factory.cleanup();
    const users = await factory.setDefaultUsers();

    userId = users[0].id;

    const tweets = await factory.setDefaultTweets(users[0].id);

    tweetId = tweets[0].id;
    token = await factory.login(request);
});

test('Positive: update tweets', () => {
    return request
        .put(`/api/v1/tweets/${tweetId}?token=${token}`)
        .send({ data : {
            title       : 'Title111',
            subtitle    : 'Subtitle111',
            text        : 'Text111',
            isPublished : true
        } })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            const { data } = body;

            assert.ok(factory.validateDate(data.createdAt));
            assert.ok(factory.validateDate(data.updatedAt));

            delete data.createdAt;
            delete data.updatedAt;

            assert.deepEqual(data, {
                id          : tweetId,
                title       : 'Title111',
                subtitle    : 'Subtitle111',
                text        : 'Text111',
                image       : '',
                isPublished : true,
                userId,
                links       : {
                    authors : [ {
                        id   : userId,
                        type : 'User'
                    } ]
                }
            });
        });
});

after(async () => {
    await factory.cleanup();
});
