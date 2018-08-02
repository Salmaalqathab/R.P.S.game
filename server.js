// server.js
// where your node app starts

// init project
var express = require('express')
var path = require('path');
var expressWs = require('express-ws');
var ews = expressWs(express());
var app = ews.app;
//const app = express()

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
console.log(app.ws)
app.ws('/ws', function (ws, req) {
    // A message has been received from a client
    console.log('ws: ', ws);
    console.log('req: ', req);
    ws.on('message', function (msg) {
        var clients = ews.getWss('/ws').clients;
        // Debug print it
        console.log('choice: ', msg);
        console.log('clients: ', clients);
        console.log(new Date().toLocaleTimeString() + '> ' + msg);

        // Broadcast it to all other clients
        clients.forEach(c => {
            console.log('c: ', c);
            c.send(msg);
        });
    });
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
    response.sendFile(__dirname + '/views/index.html')
})

// Simple in-memory store
const dreams = [
    "Find and count some sheep",
    "Climb a really tall mountain",
    "Wash the dishes"
]

app.get("/dreams", (request, response) => {
    response.send(dreams)
})

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", (request, response) => {
    dreams.push(request.query.dream)
    response.sendStatus(200)
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${listener.address().port}`)
})