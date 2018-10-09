import { assert }  from 'chai';
import supertest   from 'supertest';
import app         from '../../app';
import TestFactory from './TestFactory';

const factory     = new TestFactory();
const request     = supertest.agent(app);

suite('User create');

before(async () => {
    await factory.cleanup();
    await factory.setDefaultUsers();
});

test('Positive: Send email', () => {
    return request
        .post('/api/v1/users')
        .send({
            data : {
                email    : 'testuser@gmail.com',
                password : '123456',
                role     : 'USER'
            }
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.ok(body.status);
        });
});

test('Positive: Create user', () => {
    return request
        .post('/api/v1/users')
        .send({
            data : {
                email    : 'testuser1@gmail.com',
                password : '123456',
                role     : 'USER'
            }
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.ok(body.status);
        });
});

test('Negative: Send not unique email', () => {
    return request
        .post('/api/v1/users')
        .send({
            data : {
                email    : 'admin1@gmail.com',
                password : 'dsfdf',
                role     : 'USER'
            }
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.deepEqual(body, {
                status : 0,
                error  : {
                    code   : 'NOT_UNIQUE',
                    fields : {
                        email : 'NOT_UNIQUE'
                    }
                }
            });
        });
});

test('Negative: Create user without email and password', () => {
    return request
        .post('/api/v1/users')
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
                        'data/password' : 'REQUIRED',
                        'data/role'     : 'REQUIRED'
                    }
                }
            });
        });
});

test('Negative: Create user without data', () => {
    return request
        .post('/api/v1/users')
        .send({})
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.deepEqual(body, {
                status : 0,
                error  : {
                    code   : 'FORMAT_ERROR',
                    fields : {
                        data : 'REQUIRED'
                    }
                }
            });
        });
});

test('Negative: Create user with wrong email', () => {
    return request
        .post('/api/v1/users')
        .send({
            data : {
                email    : 'login',
                password : 'password',
                role     : 'USER'
            }
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.deepEqual(body, {
                status : 0,
                error  : {
                    code   : 'FORMAT_ERROR',
                    fields : {
                        'data/email' : 'WRONG_EMAIL'
                    }
                }
            });
        });
});

after(async () => {
    try {
        await factory.cleanup();
    } catch (e) {
        console.error(e);
        throw e;
    }
});
