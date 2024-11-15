const { Events } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    name: Events.MessageCreate,
    once: false,

    /**
     * @param {import('discord.js').Message} message
     * @param {import('discord.js').Client} client
     */
    async execute(message, client) {
        if (message.guild && !message.author.bot) {
            try {
                const guild = client.guilds.cache.get(minik.botSettings.ServerID);
                if (!guild) {
                    console.error('Guild bulunamadı!');
                    return;
                }

                const category = guild.channels.cache.get(minik.ticket.kategori);
                if (!category) {
                    console.error('Kategori bulunamadı!');
                    return;
                }

                const ticketChannel = message.channel;
                if (ticketChannel.parentId === category.id) {
                    const ticketOwnerId = ticketChannel.topic.split('ID: ')[1];
                    
                    if (ticketOwnerId) {
                        try {
                            const ticketOwner = await client.users.fetch(ticketOwnerId);
                            await ticketOwner.send(`**${message.author.tag}**: ${message.content}`);
                        } catch (error) {
                            console.log('Ticket sahibine DM gönderme hatası:', error);
                        }
                    }
                }
            } catch (error) {
                console.error('Bir hata oluştu:', error);
            }
        }
    },
};
