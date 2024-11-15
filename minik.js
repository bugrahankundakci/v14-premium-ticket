const { Partials, Client, GatewayIntentBits } = require("discord.js");
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const minik = require('./minik.json');
const eventHandlers = require('./src/handlers/eventHandlers');
const { commandMap } = require('./src/handlers/commandHandler');
const client = new Client({
    intents: Object.keys(GatewayIntentBits).map((Militan) => GatewayIntentBits[Militan]),
    partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

client.openTickets = new Set();
client.commands = new Discord.Collection();
client.interactions = new Discord.Collection();
client.selectMenus = new Discord.Collection();
client.modals = new Discord.Collection();
eventHandlers(client);

const rest = new REST({ version: '10' }).setToken(minik.botSettings.token);
(async () => {
    try {
        console.log('(/) commands initialized and refreshed!');

        await rest.put(
            Routes.applicationGuildCommands(minik.botSettings.clientID, minik.botSettings.ServerID),
            { body: commandMap.map(cmd => cmd.data.toJSON()) },
        );

        console.log('(/) commands loaded successfully!');
    } catch (error) {
        console.error(error);
    }
})();

client
    .login(minik.botSettings.token).then(() => {
    console.clear();
    console.log('[Minik API] ' + client.user.username + ' oturum açtı.');
    }).catch((err) => console.log(err)
);

process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
  });
  
  process.on("unhandledRejection", err => {
    console.error("Promise Hatası: ", err);
  });
