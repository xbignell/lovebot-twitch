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

    let compliment = getCompliment(config.dictionaries, message);

    if (compliment['message']) {
        let message = "";
        switch (compliment['key']) {
            case 'coolDictionary':
                message = '¡Tú si que eres ' + compliment['message'] + ' @' + context['display-name'];
                break;
            case 'loveDictionary':
                message = '¡A ti si que ' + compliment['message'] + ' @' + context['display-name'];
                break;
            default:
                message = "<3";
                break;
        }
        client.say(target, message);
    }
}

function getCompliment(dictionaries, message) {
    let compliment = [];

    for (var key in dictionaries) {
        let complimentMessage = checkCompliment(dictionaries[key], message);
        if (complimentMessage) {
            compliment['message'] = complimentMessage;
            compliment['key'] = key;
        }
    }

    return compliment;
}

function checkCompliment(dictionary, message) {
    let compliment = "";

    dictionary.forEach(value => {
        if (message.includes(value)) {
            compliment = value;
        }
    });

    return compliment;
}
