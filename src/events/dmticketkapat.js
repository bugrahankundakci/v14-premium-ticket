const { Events, EmbedBuilder } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const minik = require('../../minik.json');

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    async execute(interaction) {

        if (interaction.isButton() && interaction.customId === 'dmticketisil') {

            if (!interaction.member.roles.cache.has(minik.ticket.yetkili)) {
                return interaction.reply({ content: 'Bu butonu kullanmaya yetkiniz yok.', ephemeral: true });
            }

            try {
                const channel = interaction.channel;

                let ticketOwner = 'Bilinmiyor';
                if (channel.topic && channel.topic.includes(': ')) {
                    ticketOwner = channel.topic.split(': ')[1];
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

                    const now = new Date();
                    const formattedDate = now.toLocaleDateString('tr-TR');
                    const formattedTime = now.toLocaleTimeString('tr-TR');

                    const embed = new EmbedBuilder()
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .setTitle('Ticket Transcript')
                        .setDescription(
                            `Ticket açan: ${ticketOwner !== 'Bilinmiyor' ? `<@${ticketOwner}>` : 'Bilinmiyor'}\n` +
                            `Ticketi kapatan kişi: <@${interaction.user.id}> \n` +
                            `Ticket Kanalı: ${interaction.channel.name}\n` +
                            `Kapatma Zamanı: <t:${transcriptTimestamp}:R> (<t:${transcriptTimestamp}:F>)`
                        )
                        .setColor('Red')
                        .setFooter({
                            text: `${interaction.guild.name} - ${formattedDate} ${formattedTime}`,
                            iconURL: interaction.guild.iconURL(),
                        });

                    await logkanali.send({ embeds: [embed], files: [transcript] });

                    if (ticketOwner !== 'Bilinmiyor') {
                        const ticketOwnerUser = await interaction.guild.members.fetch(ticketOwner);
                        const dmEmbed = new EmbedBuilder()
                            .setTitle('Ticket kapatıldı')
                            .setDescription(`Ticketin kapatıldı, eğer yardıma ihtiyacın varsa tekrardan mesaj atabilirsin!`)
                            .setColor('Red')
                            .setFooter({
                                text: `${interaction.guild.name} - ${formattedDate} ${formattedTime}`,
                                iconURL: interaction.guild.iconURL(),
                            });

                        await ticketOwnerUser.send({ embeds: [dmEmbed] }).catch(err => {
                            console.log(`DM gönderilemedi: ${err}`);
                        });
                    }
                }
                await channel.delete();
            } catch (error) {
                console.error('An error occurred while deleting the ticket. Error:', error);
                await interaction.reply({ content: 'Ticket silinirken bir problem yaşandı.', ephemeral: true });
            }
        }
    },
};
