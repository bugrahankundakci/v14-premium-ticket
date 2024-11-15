const { ActivityType, Events } = require("discord.js");
const minik = require('../../minik.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} aktif!`);
        setPresence(client);
    },
};

async function setPresence(client) {
    const guild = client.guilds.cache.get(minik.botSettings.ServerID);

    if (!guild) {
        console.log(`Bot belirtilen sunucuda değil veya sunucu ID'si yanlış.`);
        return;
    }

    const memberCount = guild.memberCount;

    const role = guild.roles.cache.get(minik.botSettings.musterirol);

    let roleMemberCount = 0;
    if (role) {
        roleMemberCount = role.members.size;
    } else {
        console.log(`Rol bulunamadı veya ID yanlış: ${roleId}`);
    }


    client.user.setPresence({
        activities: [
            {
                name: `${roleMemberCount} müşteri ve ${memberCount} üye!`,
                type: ActivityType.Watching,
            },
        ],
        status: minik.botSettings.durum,
    });
}
