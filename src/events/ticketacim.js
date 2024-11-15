const { Events, PermissionsBitField, ActionRowBuilder, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const minik = require('../../minik.json');
const { addTicket, hasActiveTicket, setActiveTicket } = require('../handlers/ticketdb');

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    async execute(interaction) {
        if (interaction.isButton() && interaction.customId === 'ticketacim') {
            const userId = interaction.user.id;
            if (hasActiveTicket(userId)) {
                await interaction.reply({ content: 'Zaten aktif bir ticket\'ınız var. Lütfen mevcut ticket\'ınızı kapatın.', ephemeral: true });
                return;
            }
            const data = require('../database/ticketData.json');
            const ticketId = Date.now();
            const ticketCounter = data.ticketCounter += 1;
            const ticketChannelName = `${ticketCounter}・${interaction.user.username}`;

            const minikinbutonu2 = new ButtonBuilder()
            .setCustomId('deviral')
            .setLabel('Talebi Devral')
            .setEmoji('🖐️')
            .setStyle(ButtonStyle.Success);

            const militaninbutonu = new ButtonBuilder()
                .setCustomId('ticketisil')
                .setLabel('Talebi Kapat')
                .setEmoji('🔒')
                .setStyle(ButtonStyle.Danger);
            
            const actionRowMenu = new ActionRowBuilder().addComponents(minikinbutonu2, militaninbutonu);
            const militaninmesaji = `<@${interaction.user.id}> - <@&${minik.ticket.yetkili}>`;

            const createTicketChannel = async (channelName) => {
                try {
                    const channel = await interaction.guild.channels.create({
                        type: ChannelType.GuildText,
                        parent: minik.ticket.kategori,
                        name: channelName,
                        topic: `Ticket Owner aydi: ${interaction.user.id}`,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.roles.everyone.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: minik.ticket.yetkili,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            },
                        ],
                    });


                    setActiveTicket(userId, channel.id);

                    addTicket({
                        ownerId: interaction.user.id,
                        ticketId: ticketId,
                        channelId: channel.id,
                        channelName: channelName,
                        timestamp: Date.now()
                    });

                    return channel;
                } catch (error) {
                    console.error('Ticket kanalı oluşturulurken bir hata oluştu:', error);
                    throw new Error('Kanal oluşturulurken bir hata oluştu.');
                }
            };

            try {

                await interaction.reply({ content: `<@${interaction.user.id}> Ticketiniz açılıyor...`, ephemeral: true });
                const destekticketi = await createTicketChannel(ticketChannelName);
                const now = new Date();
                const formattedDate = now.toLocaleDateString('tr-TR');
                const formattedTime = now.toLocaleTimeString('tr-TR');
                const transcriptTimestamp = Math.round(Date.now() / 1000);

                const militaninticketegonderdigimesaj = new EmbedBuilder()
                    .setColor('#ae9ccf')
                    .setTitle(`${interaction.guild.name} - Ticket System`)
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setFooter({
                        text: `${interaction.guild.name} - ${formattedDate} ${formattedTime}`,
                    })
                    .setDescription(`Merhaba <@${interaction.user.id}>, destek talebiniz başarıyla oluşturuldu. \n\n - Oluşturulma zamanı: <t:${transcriptTimestamp}:R> \n\n - Isteğinizi/sorunuzu mesaj olarak ilettiyseniz beklemede kalınız, müsait olan ekip arkadaşlarımız sizinle ilgilenecektir.`);

                await destekticketi.send({
                    embeds: [militaninticketegonderdigimesaj],
                    components: [actionRowMenu]
                });

                if (destekticketi) {
                    const militaninsilmemesajı = await destekticketi.send(militaninmesaji);
                    setTimeout(() => {
                        militaninsilmemesajı.delete();
                    }, 1500);
                }



            } catch (error) {
                console.error('Ticket açılırken bir hata oluştu:', error);
                await interaction.reply({ content: 'Ticket açılırken bir hata oluştu.', ephemeral: true });
            }
        }

    },
};
