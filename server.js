const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');

// Routes
const api = require('./server/routes/api');

const app = express();

// Parsers
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb', extended: true}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist/VapeDad')));

// API location
app.use('/api', api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    //res.json(req);
    res.sendFile(path.join(__dirname, 'dist/VapeDad/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));