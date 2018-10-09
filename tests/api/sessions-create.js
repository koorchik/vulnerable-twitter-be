import { assert }  from 'chai';
import supertest   from 'supertest';
import jwt         from 'jsonwebtoken';

import app         from '../../app';
import config      from '../../etc/config.json';
import TestFactory from './TestFactory';

const secret  = config.secret;
const factory = new TestFactory();
const request = supertest.agent(app);

let userId;

suite('Sessions Create');

before(async () => {
    await factory.cleanup();
    const users = await factory.setDefaultUsers();

    userId = users[0].id;
});

test('Positive: authenticate user', () => {
    return request
        .post('/api/v1/sessions')
        .send({ data: { email: 'admin1@gmail.com', password: 'password1' } })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.ok(body.status);

            jwt.verify(body.data.jwt, secret, (err, decoded) => {
                if (err) throw err;

                const got = {
                    id         : decoded.id,
                    email      : decoded.email,
                    status     : decoded.status,
                    firstName  : decoded.firstName,
                    secondName : decoded.secondName
                };

                assert.deepEqual(got, {
                    id         : userId,
                    email      : 'admin1@gmail.com',
                    status     : 'ACTIVE',
                    firstName  : '',
                    secondName : ''
                });
            });
        });
});

test('Positive: Login user', () => {
    return request
        .post('/api/v1/sessions')
        .send({ data: { email: 'admin1@gmail.com', password: 'password1' } })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.deepEqual(body, {
                status : 1,
                data   : {
                    jwt : body.data.jwt
                }
            });
        });
});

test('Negative: authenticate blocked user', () => {
    return request
        .post('/api/v1/sessions')
        .send({ data: { email: 'admin2@gmail.com', password: 'password2' } })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.deepEqual(body, {
                status : 0,
                error  : {
                    code   : 'NOT_ACTIVE_USER',
                    fields : {
                        status : 'NOT_ACTIVE_USER'
                    }
                }
            });
        });
});

test('Negative: Wrong password', () => {
    return request
        .post('/api/v1/sessions')
        .send({ data: { email: 'admin1@gmail.com', password: 'wrong_password' } })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.deepEqual(body, {
                status : 0,
                error  : {
                    code   : 'AUTHENTICATION_FAILED',
                    fields : {
                        email    : 'INVALID',
                        password : 'INVALID'
                    }
                }
            });
        });
});


test('Negative: Not existing user', () => {
    return request
        .post('/api/v1/sessions')
        .send({ data: { email: 'notexist@gmail.com', password: 'wrong_password' } })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.deepEqual(body, {
                status : 0,
                error  : {
                    code   : 'AUTHENTICATION_FAILED',
                    fields : {
                        email    : 'INVALID',
                        password : 'INVALID'
                    }
                }
            });
        });
});

test('Negative: Empty data', () => {
    return request
        .post('/api/v1/sessions')
        .send({ data: {} })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.deepEqual(body, {
                status : 0,
                error  : {
                    code   : 'FORMAT_ERROR',
                    fields : {
                        'data/email'    : 'REQUIRED',
                        'data/password' : 'REQUIRED'
                    }
                }
            });
        });
});

test('Negative: Broken json', () => {
    return request
        .post('/api/v1/sessions')
        .set('Content-Type', 'application/json')
        .send('{ddd,aa,bb}')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.equal(body.status, 0);
            assert.equal(body.error.code, 'BROKEN_JSON');
        });
});

after(async () => {
    await factory.cleanup();
});
