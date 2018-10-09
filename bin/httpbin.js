const express = require('express')
const app = express()
const appPort = 5000;

app.all('/', function (req, res) {
    console.log('REQUEST URL:', req.url)
    console.log('REQUEST BODY:', req.body);
    res.send('OK');
});

app.listen(appPort, () => {
    console.log(`APP STARTING AT PORT ${appPort}`);
});