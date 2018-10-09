import { assert }  from 'chai';
import supertest   from 'supertest';
import app         from '../../app';
import TestFactory from  './TestFactory';

const factory     = new TestFactory();
const request     = supertest.agent(app);

let token;
let adminToken;
let tweets;
/* eslint-disable */
let userId1;
let userId2;
/* eslint-enable */

suite('User List');

before(async () => {
    await factory.cleanup();
    const users = await factory.setDefaultUsers();

    userId1 = users[0].id;
    userId2 = users[1].id;
    // userId3 = users[2].id;

    tweets = await factory.setDefaultTweets(userId1);

    token = await factory.login(request);
    adminToken = await factory.loginAsAdmin(request);
});

test('Positive: Show all users', () => {
    return request
        .get(`/api/v1/users?token=${token}`)
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            const { data } = body;

            assert.ok(body.status);
            assert.ok(factory.validateDate(data[0].createdAt));
            assert.ok(factory.validateDate(data[1].createdAt));
            assert.ok(factory.validateDate(data[0].updatedAt));
            assert.ok(factory.validateDate(data[1].updatedAt));

            delete data[0].createdAt;
            delete data[1].createdAt;
            delete data[2].createdAt;
            delete data[0].updatedAt;
            delete data[1].updatedAt;
            delete data[2].updatedAt;

            const expectedData = [
                {
                    id         : userId1,
                    email      : 'admin1@gmail.com',
                    status     : 'ACTIVE',
                    role       : 'USER',
                    firstName  : '',
                    secondName : ''
                },
                {
                    id         : userId2,
                    email      : 'admin2@gmail.com',
                    status     : 'BLOCKED',
                    role       : 'USER',
                    firstName  : '',
                    secondName : ''
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

test('Negative: Show all users with wrong role', () => {
    return request
        .get(`/api/v1/users?token=${adminToken}`)
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.deepEqual(body, {
                status : 0,
                error  : {
                    fields : { userRole: 'ADMIN' },
                    code   : 'PERMISSION_DENIED'
                }
            });
        });
});

test('Positive: Show all users with tweets', () => {
    return request
        .get(`/api/v1/users?include=tweets&token=${token}`)
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            const { data, linked } = body;

            assert.ok(body.status);
            assert.ok(factory.validateDate(data[0].createdAt));
            assert.ok(factory.validateDate(data[1].createdAt));
            assert.ok(factory.validateDate(data[0].updatedAt));
            assert.ok(factory.validateDate(data[1].updatedAt));

            delete data[0].createdAt;
            delete data[1].createdAt;
            delete data[2].createdAt;
            delete data[0].updatedAt;
            delete data[1].updatedAt;
            delete data[2].updatedAt;

            const expectedData = [
                {
                    id         : userId1,
                    email      : 'admin1@gmail.com',
                    status     : 'ACTIVE',
                    role       : 'USER',
                    firstName  : '',
                    secondName : '',
                    links      : {
                        tweets : [
                            {
                                id   : tweets[0].id,
                                type : 'Tweet'
                            },
                            {
                                id   : tweets[1].id,
                                type : 'Tweet'
                            },
                            {
                                id   : tweets[2].id,
                                type : 'Tweet'
                            }
                        ]
                    }
                },
                {
                    id         : userId2,
                    email      : 'admin2@gmail.com',
                    status     : 'BLOCKED',
                    role       : 'USER',
                    firstName  : '',
                    secondName : '',
                    links      : {
                        tweets : []
                    }
                }
            ];

            const expectedLinkedData = {
                tweets : [ {
                    id          : tweets[2].id,
                    userId      : userId1,
                    title       : 'Title3',
                    subtitle    : 'Subtitle3',
                    text        : 'Text3',
                    image       : '',
                    isPublished : false,
                    links       : {
                        authors : [
                            {
                                id   : userId1,
                                type : 'User'
                            }
                        ]
                    }
                },
                {
                    id          : tweets[1].id,
                    userId      : userId1,
                    title       : 'Title2',
                    subtitle    : 'Subtitle2',
                    text        : 'Text2',
                    image       : '',
                    isPublished : false,
                    links       : {
                        authors : [
                            {
                                id   : userId1,
                                type : 'User'
                            }
                        ]
                    }
                }, {
                    id          : tweets[0].id,
                    userId      : userId1,
                    title       : 'Title',
                    subtitle    : 'Subtitle',
                    text        : 'Text',
                    image       : '',
                    isPublished : false,
                    links       : {
                        authors : [
                            {
                                id   : userId1,
                                type : 'User'
                            }
                        ]
                    }
                } ]
            };

            body.data.forEach(dataItem => {
                expectedData.forEach(expectedDataItem => {
                    if (expectedDataItem.id === dataItem.id) {
                        assert.deepEqual(dataItem, expectedDataItem);
                    }
                });
            });

            linked.tweets.forEach(dataItem => {
                delete dataItem.createdAt; // eslint-disable-line
                delete dataItem.updatedAt; // eslint-disable-line

                expectedLinkedData.tweets.forEach(expectedDataItem => {
                    if (expectedDataItem.id === dataItem.id) {
                        assert.deepEqual(dataItem, expectedDataItem);
                    }
                });
            });
        });
});

test('Positive: Show user by Id', () => {
    return request
        .get(`/api/v1/users/${userId1}?token=${token}`)
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            const { data } = body;

            assert.ok(body.status);
            assert.ok(factory.validateDate(body.data.createdAt));
            assert.ok(factory.validateDate(body.data.updatedAt));

            delete data.createdAt;
            delete data.updatedAt;

            assert.deepEqual(body.data, {
                id         : userId1,
                email      : 'admin1@gmail.com',
                status     : 'ACTIVE',
                role       : 'USER',
                firstName  : '',
                secondName : ''
            });
        });
});

test('Negative: Show user with wrong Id', () => {
    return request
        .get(`/api/v1/users/54107e0ca3eeef5a662148fb?token=${token}`)
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
    try {
        await factory.cleanup();
    } catch (err) {
        console.error(err);
    }
});
