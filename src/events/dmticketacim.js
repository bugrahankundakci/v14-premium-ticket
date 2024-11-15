const { Events, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    
    async execute(interaction) {
        if (interaction.isButton() && interaction.customId === 'dmticketiacim') {
            try {
                const militaninbutonu = new ButtonBuilder()
                .setLabel('Tıkla git!')
                .setEmoji('🔒')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://discord.com/channels/@me/${minik.ticket.dmticketkanalid}`);
            
                const actionRowMenu = new ActionRowBuilder().addComponents(militaninbutonu);
                const elemanembed = new EmbedBuilder()
                .setTitle('DM Ticket')
                .setColor('Grey')
                .setDescription(`DM biletiniz başarıyla alındı ​​ancak aktif değil. Mesaj yazarak biletinizi aktif hale getirebilirsiniz!`)
                await interaction.member.send({ content: `<@${interaction.member.id}>`, embeds: [elemanembed] })

                await interaction.reply({ 
                    content: `DM biletiniz başarıyla oluşturuldu`, 
                    ephemeral: true,
                    components: [actionRowMenu]
                })
            } catch (error) {
                console.error('Ticket açılırken bir sorun oluştu', error);
                await interaction.reply({ content: 'DM\'nin kapalı DM ayarlarını düzelttikten sonra tekrar ticket oluşturmayı deneyiniz.', error, ephemeral: true });
            }
        }
    },
};
