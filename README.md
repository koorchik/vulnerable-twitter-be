RUN DEVELOPMENT VERSION


apt-get install mysql-server (5.7.8 version).
npm install.
Create mysql schema.
cp etc/config.json.sample etc/config.json. You can use your gmail acc for testing email sending but you'll neeed to set real email and password in config.
cp etc/db.json.sample etc/db.json. Set correct database options.
npm run migration-dev
npm run nodemon
open http://localhost:8080/apidoc in browser (DEPRECATED)


RUN PRODUCTION VERSION

apt-get install mysql-server (5.7.8 version).
npm install.
Create mysql schema.
cp etc/config.json.sample etc/config.json. Set SMTP options (or use local sendmail)
cp etc/db.json.sample etc/db.json. Set correct database options.
npm run migration
nmp start


RUN AS LAMBDA
1. npm install -g claudia
2. Make sure that you have installed aws cli and setup it.
3. Prepare RDS or other MySql server and run migration.
3. npm run migration
4. claudia generate-serverless-express-proxy --express-module runner
5. claudia create --handler lambda.handler --deploy-proxy-api --region eu-central-1 --role modern-node-be-executor --aws-client-timeout 1200000 --set-env-from-json lambda.env.json

FOR UPDATE:
6. claudia update --handler lambda.handler --deploy-proxy-api --region eu-central-1 --role modern-node-be-executor --aws-client-timeout 1200000 --set-env-from-json lambda.env.json 


