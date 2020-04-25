#!/usr/bin/env bash

npm run migration:dev
npx babel-node ./bin/add_user.js --email attacker@mail.com --password password
npx babel-node ./bin/add_user.js --email user1@mail.com --password password
npx babel-node ./bin/add_user.js --email user2@mail.com --password password