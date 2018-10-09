import { assert }  from 'chai';
import supertest   from 'supertest';

import app             from '../../app';
import TestFactory     from './TestFactory';

const factory = new TestFactory();
const request = supertest.agent(app);

/* eslint-disable */
let tweetId1;
let tweetId2;
let tweetId3;
let userId;
/* eslint-enable */

suite('Tweets List');

before(async () => {
    await factory.cleanup();
    const users = await factory.setDefaultUsers();

    userId = users[0].id;

    const tweets = await factory.setDefaultTweets(userId);

    tweetId1 = tweets[0].id;
    tweetId2 = tweets[1].id;
    tweetId3 = tweets[2].id;
});

test('Positive: Show all tweets', () => {
    return request
        .get('/api/v1/tweets')
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            const { data } = body;

            assert.ok(body.status);
            assert.ok(factory.validateDate(data[0].createdAt));
            assert.ok(factory.validateDate(data[1].createdAt));
            assert.ok(factory.validateDate(data[2].createdAt));
            assert.ok(factory.validateDate(data[0].updatedAt));
            assert.ok(factory.validateDate(data[1].updatedAt));
            assert.ok(factory.validateDate(data[2].updatedAt));

            delete data[0].createdAt;
            delete data[1].createdAt;
            delete data[2].createdAt;
            delete data[0].updatedAt;
            delete data[1].updatedAt;
            delete data[2].updatedAt;

            const expectedData = [
                {
                    id          : tweetId1,
                    title       : 'Title',
                    subtitle    : 'Subtitle',
                    text        : 'Text',
                    image       : '',
                    isPublished : false,
                    userId,
                    links       : {
                        authors : [ {
                            id   : userId,
                            type : 'User'
                        } ]
                    }
                },
                {
                    id          : tweetId2,
                    title       : 'Title2',
                    subtitle    : 'Subtitle2',
                    text        : 'Text2',
                    image       : '',
                    isPublished : false,
                    userId,
                    links       : {
                        authors : [ {
                            id   : userId,
                            type : 'User'
                        } ]
                    }
                },
                {
                    id          : tweetId3,
                    title       : 'Title3',
                    subtitle    : 'Subtitle3',
                    text        : 'Text3',
                    image       : '',
                    isPublished : false,
                    userId,
                    links       : {
                        authors : [ {
                            id   : userId,
                            type : 'User'
                        } ]
                    }
                }
            ];

            body.data.forEach(dataItem => {
                expectedData.forEach(expectedDataItem => {
                    if (expectedDataItem.id === dataItem.id) {
                        assert.deepEqual(dataItem, expectedDataItem);
                    }
                });
            });
        });
});

test('Positive: Show tweets by Id', () => {
    return request
        .get(`/api/v1/tweets/${tweetId1}`)
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            const { data } = body;

            assert.ok(body.status);
            assert.ok(factory.validateDate(data.createdAt));
            assert.ok(factory.validateDate(data.updatedAt));

            delete data.createdAt;
            delete data.updatedAt;

            assert.deepEqual(data, {
                id          : tweetId1,
                title       : 'Title',
                subtitle    : 'Subtitle',
                text        : 'Text',
                image       : '',
                userId,
                isPublished : false,
                links       : {
                    authors : [ {
                        id   : userId,
                        type : 'User'
                    } ]
                }
            });
        });
});

test('Negative: Show tweets with wrong Id', () => {
    return request
        .get('/api/v1/tweets/54107e0ca3eeef5a662148fb')
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.deepEqual(body, {
                status : 0,
                error  : {
                    code   : 'WRONG_ID',
                    fields : {
                        id : 'WRONG_ID'
                    }
                }
            });
        });
});


after(async () => {
    await factory.cleanup();
});
