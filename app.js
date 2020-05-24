const tmi = require('tmi.js');
require('dotenv').config();
const config = require('./app/config');

const options = {
    identity: {
        username: process.env.username,
        password: process.env.token
    },
    channels: config.channels
};

const client = new tmi.client(options);

client.on("message", onMessageHandler);

client.connect();

function onMessageHandler(target, context, message, self) {
    if (self) return;

    if (target === '#' + context['display-name']) {
        client.say(target, 'Stremea y shht!');
        return;
    }

    let compliment = "";

    let messageSplited = message.split(' ');
    messageSplited.forEach(value => {
        if (config.dictionaries.coolDictionary.includes(value)) {
            compliment = value
        }
    });

    if (compliment) {
        client.say(target, '¡Tú si que eres ' + compliment + ' @' + context['display-name']);
    }
}



