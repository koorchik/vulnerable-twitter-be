import { assert }  from 'chai';
import supertest   from 'supertest';
import app         from '../../app';
import TestFactory from  './TestFactory';

const factory = new TestFactory();
const request = supertest.agent(app);

let token;

/* eslint-disable */
let userId1;
let userId2;
/* eslint-enable */

suite('User update');

before(async () => {
    const users = [
        {
            email    : 'snow@gmail.com',
            password : 'password1',
            status   : 'ACTIVE',
            role     : 'USER'
        },

        {
            email    : 'login@gov.ua',
            password : 'password2',
            status   : 'PENDING',
            role     : 'USER'
        }
    ];


    await factory.cleanup();

    const createdUsers = await Promise.all(users.map(factory.createUser));

    userId1 = createdUsers[0].id;
    userId2 = createdUsers[1].id;

    return new Promise(resolve => {
        request // Authenticate
            .post('/api/v1/sessions')
            .send({ data: { email: 'snow@gmail.com', password: 'password1' } })
            .expect(({ body }) => {
                assert.ok(body.status);
            }).end((err, { body }) => {
                if (err) {
                    throw err;
                }

                token = body.data.jwt;
                resolve();
            });
    });
});

test('Positive: Update user', () => {
    return request
        .put(`/api/v1/users/${userId1}?token=${token}`)
        .send({
            data : {
                firstName  : 'Jon',
                secondName : 'Snow'
            }
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
            assert.ok(res.body.status);
        });
});

test('Positive: Check updated user', () => {
    return request
        .get(`/api/v1/users/${userId1}?token=${token}`)
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
            const resp = res;

            assert.ok(resp.body.status);
            assert.ok(factory.validateDate(resp.body.data.createdAt));
            assert.ok(factory.validateDate(resp.body.data.updatedAt));

            delete resp.body.data.createdAt;
            delete resp.body.data.updatedAt;

            assert.deepEqual(resp.body.data, {
                id         : userId1,
                email      : 'snow@gmail.com',
                status     : 'ACTIVE',
                role       : 'USER',
                firstName  : 'Jon',
                secondName : 'Snow'
            });
        });
});

test('Negative: Update user with wrong Id', () => {
    return request
        .put(`/api/v1/users/54107e0ca3eeef5a662148fb?token=${token}`)
        .send({
            data : {
                language : 'en'
            }
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
            assert.deepEqual(res.body, {
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

test('Negative: Update other user', () => {
    return request
        .put(`/api/v1/users/${userId2}?token=${token}`)
        .send({
            data : {
                companyName : 'New kingdom'
            }
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
            assert.deepEqual(res.body, {
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
    } catch (e) {
        console.error(e);
        throw e;
    }
});
