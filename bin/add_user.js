#!/usr/bin/env node
import { docopt } from 'docopt';
import sequelize from '../lib/sequelize';

const User   = sequelize.model('User');

const doc =
`Usage:
   add_user.js --email=<email> --password=<password> [--name=<name>] [--drop]
   add_user.js -h | --help

Options:
   -h --help                 Show this screen.
   -l --email <email>        Login for new user.
   -p --password <password>  Password for new user.
   -d --drop                 Drop database first.
`;

main(docopt(doc)).then(() => {
    process.exit();
});

async function dropAllUsers() {
    await User.destroy({ where: {} });
}

async function main(opts) {
    const userData = {
        email    : opts['--email'] ? opts['--email'] : 'admin@mail.com',
        password : opts['--password'],
        status   : 'ACTIVE'
    };

    if (opts['--drop']) await dropAllUsers();

    await User.create(userData);
}

