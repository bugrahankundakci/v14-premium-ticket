const { Events, EmbedBuilder } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const minik = require('../../minik.json');
const { clearActiveTicket } = require('../handlers/ticketdb');

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    async execute(interaction) {

        if (interaction.isButton() && interaction.customId === 'ticketisil') {

            if (!interaction.member.roles.cache.has(minik.ticket.yetkili)) {
                return interaction.reply({ content: 'Bu butonu kullanma yetkiniz yok.', ephemeral: true });
            }

            try {
                const channel = interaction.channel;
                
                let ticketOwner = 'Bilinmiyor';
                if (channel.topic && channel.topic.includes('aydi: ')) {
                    ticketOwner = channel.topic.split('aydi: ')[1];
                }
                const transcript = await createTranscript(channel, {
                    limit: -1,
                    returnBuffer: false,
                    filename: `ticket-${interaction.channel.name}.html`,
                    saveImages: true,
                    useCDN: true
                });

                const logkanali = interaction.guild.channels.cache.get(minik.ticket.transcriptsChannelId);
                if (logkanali) {
                    const transcriptTimestamp = Math.round(Date.now() / 1000);
                    const embed = new EmbedBuilder()

                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .setTitle('Ticket Transcript')
                        .setDescription(
                            `Ticket açan: ${ticketOwner !== 'Bilinmiyor' ? `<@${ticketOwner}>` : 'Bilinmiyor'}\n` +
                            `Ticketi kapatan kişi: <@${interaction.user.id}> \n`+
                            `Ticket Kanalı: ${interaction.channel.name}\n` +
                            `Kapatma Zamanı: <t:${transcriptTimestamp}:R> (<t:${transcriptTimestamp}:F>)`
                        )
                        .setColor('Red')
                        .setFooter({
                            text: interaction.guild.name,
                            iconURL: interaction.guild.iconURL(),
                        });
                    await logkanali.send({ embeds: [embed], files: [transcript] });
                }
                if (ticketOwner !== 'Bilinmiyor') {
                    clearActiveTicket(ticketOwner);
                }
                await channel.delete();
            } catch (error) {
                console.error('Ticket silinirken bir hata oluştu:', error);
                await interaction.reply({ content: 'An error occurred while deleting the ticket.', ephemeral: true });
            }
        }
    },
};
