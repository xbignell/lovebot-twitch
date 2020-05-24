const tmi = require('tmi.js');
require('dotenv').config();

const options = {
    identity: {
        username: process.env.username,
        password: process.env.token
    },
    channels: [
        'gerentwitch'
    ]
};

const client = new tmi.client(options);

client.on("message", onmessagehandler);

client.connect();

function onmessagehandler(target, context, message, self) {
    if (self) return;

    if (message === "guapa") {
        client.say(target, '¡tú si que eres guap@! @' + context['display-name']);
    }
}



