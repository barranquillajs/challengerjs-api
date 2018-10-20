const io = require('socket.io')(80);

let Users = {
    Rafaell416_80: { admin: true },
    CamiloTD_443 : { admin: true },
    Maquinox_1521: { admin: true }
};

let Sessions = {

};

let Challenges = {

};

let current_challenge = null;

io.on('connection', function (sock) {
    let user = null;

    sock.on('login', (name) => {
        if(Sessions[name]) return sock.emit('login-error', "NAME_ALREADY_TAKEN");
        if(!Users[name]) Users[name] = { admin: false };
        
        user = Users[name]
        user.name = name;

        Sessions[name] = { name };

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

    }

    function createChallenge ({ name, description, inputs, outputs, timeout, runs }) {
        if(!description) description = "";
        if(!inputs) inputs = [];
        if(!outputs) outputs = [];

        current_challenge = Challenges[name] = { name, description, inputs, outputs, timeout, runs, submits: {} };

        io.emit('challenge', { name, description, timeout, runs });
    }

    if(current_challenge)
        sock.emit('challenge', {
            name: current_challenge.name,
            description: current_challenge.description,
            timeout: current_challenge.timeout,
            runs: current_challenge.runs
        });
});