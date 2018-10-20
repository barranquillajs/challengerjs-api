const io = require('socket.io')(80);

let Users = {
    Rafaell416_80: { admin: true },
    CamiloTD_443 : { admin: true },
    Maquinox_1521: { admin: true }
};

let Sessions = {

};

io.on('connection', function (sock) {
    let user = null;

    sock.on('login', (name) => {
        if(Sessions[name]) return sock.emit('login-error', "NAME_ALREADY_TAKEN");
        if(!Users[name]) Users[name] = { admin: false };

        Sessions[name] = {};
        user.name = name;

        if(user.admin) grantAdmin(sock);
        else grantUser(sock);
 
        sock.emit('login-success', user = Users[name]);
    });

    sock.on('disconnect', () => {
        if(user) Sessions[name] = user.name;
    });


    function grantAdmin (sock) {
        
    }

    function grantUser (sock) {

    }
});