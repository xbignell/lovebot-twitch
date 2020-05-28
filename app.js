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

    let compliment = __getCompliment(config.dictionaries, message);

    if (compliment['message']) {
        let message = __getRandomMessage(compliment, context);
        client.say(target, message);
    }
}

function __getCompliment(dictionaries, message) {
    let compliment = [];

    for (var key in dictionaries) {
        let complimentMessage = __checkCompliment(dictionaries[key], message);
        if (complimentMessage) {
            compliment['message'] = complimentMessage;
            compliment['key'] = key;
        }
    }

    return compliment;
}

function __checkCompliment(dictionary, message) {
    let compliment = "";

    dictionary.forEach(value => {
        if (message.includes(value)) {
            compliment = value;
        }
    });

    return compliment;
}

function __getRandomMessage(compliment, context) {
    const messagesCount = config['messages'][compliment['key']].length;
    let randomMessage = Math.floor(Math.random() * (messagesCount - 0));
    let message = config['messages'][compliment['key']][randomMessage];

    const arrayOptions = {
        user: context['display-name'],
        compliment: compliment['message']
    };

    return __translateVariables(message, arrayOptions);
}

function __translateVariables(message, arrayOptions) {
    if (message.includes("%user%")) {
        message = message.replace("%user%", "@" + arrayOptions['user']);
    }
    if (message.includes("%compliment%")) {
        message = message.replace("%compliment%", arrayOptions['compliment']);
    }

    return message;
}
