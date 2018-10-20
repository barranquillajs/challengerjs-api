const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');

const cp = require('child_process');
const util = require('util');
const fs = require('fs');
const read = util.promisify(fs.read);
const write = util.promisify(fs.write);
const template = require('./template');

let Users = {
    Rafaell416_80: { admin: true },
    CamiloTD_443 : { admin: true },
    Maquinox_1521: { admin: true }
};

let Sessions = {};
let Challenges = {};
let current_challenge = null;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    // res.header('Content-Security-Policy')
    // res.header('upgrade-insecure-requests')
    next()
  })
http.listen(800, () => console.log("Server up!"));


io.on('connection', function (sock) {
    let user = null;

    sock.on('login', (name) => {
        if(Sessions[name]) return sock.emit('login-error', "NAME_ALREADY_TAKEN");
        if(!Users[name]) Users[name] = { admin: false };
        
        user = Users[name]
        user.name = name;

        Sessions[name] = { name, sock, admin: user.admin };

        if(user.admin) grantAdmin(sock);
        else grantUser(sock);
 
        sock.emit('login-success', user);
    });

    sock.on('disconnect', () => {
        if(user) Sessions[name] = user.name;
    });


    function grantAdmin (sock) {
        sock.on('create', createChallenge);
    }

    function grantUser (sock) {
        sock.on('submit', submitChallenge);
    }

    function createChallenge ({ name, description, inputs, outputs, timeout, runs }) {
        if(!description) description = "";
        if(!inputs) inputs = [];
        if(!outputs) outputs = [];

        current_challenge = Challenges[name] = { name, description, inputs, outputs, timeout, runs, submits: {} };

        io.emit('challenge', { name, description, timeout, runs });
    }

    async function submitChallenge (code) {
        if(!current_challenge) return sock.emit("submit-failed", "CHALLENGE_IS_NOT_READY_YET");

        let result = await TestCode(code);

        if(!result.success) return sock.emit("submit-failed", result.error);

        current_challenge.submits[user.name] = result;

        sock.emit("submit-success", {
            time: result.time,
            length: result.length
        });

        for(let i in Sessions) if(Sessions[i].admin) Sessions[i].sock.emit("submit", {
            player: user.name,
            ...result
        })
    }

    function TestCode (code) {
        return new Promise((resolve, reject) => {

            let filename = Math.random().toString().substring(2) + ".js";

            fs.writeFile(filename, template(code), function (err) {
                if(err) {
                    console.log(err);
                    return reject({ code: "COULDNT_WRITE", message: "Cannot write codefile"});
                }
                
                let timer = setTimeout(() => {
                    reject({ code: "TIMEOUT", message: "Your code ran too slow."});
                }, challenge.timeout)
            });
        });
    }

    if(current_challenge)
        sock.emit('challenge', {
            name: current_challenge.name,
            description: current_challenge.description,
            timeout: current_challenge.timeout,
            runs: current_challenge.runs
        });
});