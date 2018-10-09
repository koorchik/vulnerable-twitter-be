import { assert }  from 'chai';
import supertest   from 'supertest';

import app             from '../../app';
import TestFactory     from './TestFactory';

const factory = new TestFactory();
const request = supertest.agent(app);

suite('Permissions');

before(async () => {
    await factory.cleanup();
    await factory.setDefaultUsers();
});

test('Negative: try read user with malformed JWT', () => {
    return request
        .get('/api/v1/users?token=123')
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.deepEqual(body, {
                status : 0,
                error  : {
                    code   : 'PERMISSION_DENIED',
                    fields : {
                        token : 'WRONG_TOKEN'
                    }
                }
            });
        });
});

test('Negative: try read user with incorrect user id in session', () => {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1MDE3NzA0NjcsImV4cCI6MTUzMzMwNjQ2NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.sWrkse-Wx0_DLfkInc4t6eD1wfqX0Y_2-Ms75scEGl4';

    return request
        .get(`/api/v1/users?token=${token}`)
        .send()
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
            assert.deepEqual(body, {
                status : 0,
                error  : {
                    code   : 'PERMISSION_DENIED',
                    fields : {
                        token : 'WRONG_TOKEN'
                    }
                }
            });
        });
});
after(async () => {
    await factory.cleanup();
});
