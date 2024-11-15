const { Events, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    async execute(interaction) {
        if (interaction.isButton() && interaction.customId === 'deviral') {
            if (!interaction.member.roles.cache.has(minik.ticket.yetkili)) {
                return interaction.reply({
                    content: `Bileti devralabilmeniz için <@&${minik.ticket.yeklili}> rolüne sahip olmanız gerekmektedir.`,
                    ephemeral: true
                });
            }

            try {
                await interaction.reply({ content: `Ticket'i başarıyla devir aldınız.`, ephemeral: true });
                const channel = interaction.channel;
                
                const webhooks = await channel.fetchWebhooks();
                for (const webhook of webhooks.values()) {
                    await webhook.delete();
                }

                const webhook = await channel.createWebhook({
                    name: `${interaction.member.displayName}`,
                    avatar: interaction.user.displayAvatarURL(),
                });
                await webhook.send({ content: `Merhaba, ben **${interaction.member.displayName}**. Şimdi biletinizi devraldım. Size nasıl yardım edebilirim?` });
                
                const ticketialan = interaction.member.displayName;

                let ticketOwnerId = null;
                if (channel.topic && channel.topic.includes('aydi: ')) {
                    ticketOwnerId = channel.topic.split('aydi: ')[1];
                }

                if (ticketOwnerId) {
                    try {
                        const ticketChannel = interaction.channel;
                        const ticketGuild = interaction.guild;
                        const ticketOwner = await interaction.guild.members.fetch(ticketOwnerId).then(member => member.user);
                        
                        const tiklagit = new ButtonBuilder()
                        .setLabel('Tıkla git')
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://discord.com/channels/${ticketGuild.id}/${ticketChannel.id}`)

                        const embedcik = new EmbedBuilder()
                        .setTitle(`Merhaba, ${ticketOwner.username}`)
                        .setDescription(`${ticketGuild.name} sunucusunda oluşturduğunuz destek talebi devralındı. \n Yetkili: ${ticketialan} \n\n\n __Sizden dönüş bekleniyor.__`)

                        const actionrowmenu = new ActionRowBuilder().addComponents(tiklagit);
                        await ticketOwner.send({ 
                            embeds: [embedcik],
                            components: [actionrowmenu]
                        });
                    } catch (error) {
                        console.log('DM gönderme hatası:', error);
                        await channel.send({ content: 'Bilet sahibine DM gönderilemedi. Kullanıcının DM ayarlarını kontrol edin.' });
                    }
                } else {
                    console.log('Ticket holder not found.');
                }

            } catch (error) {
                console.log(`There is an error in ticket pickup:`, error);
            }
        }
    }
};
