const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const minik = require('../../minik.json');
const openTickets = new Set();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-olustur')
        .setDescription('Kullanıcıların ticket oluşturması için ticket menüsü gönderir.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        if (openTickets.has(interaction.user.id)) {
            await interaction.reply({ content: 'Zaten açık bir ticketiniz var.', ephemeral: true });
            return;
        }

        const now = new Date();
        const formattedDate = now.toLocaleDateString('tr-TR');
        const formattedTime = now.toLocaleTimeString('tr-TR');
    

        const militanembed = new EmbedBuilder()

            .setTitle(interaction.guild.name)
            .setColor('ae9ccf')
            .setDescription(minik.ticket.menuayarlari.mesaj)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setAuthor({
                name: interaction.guild.name,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
            })
           .setFooter({
            text: `${interaction.guild.name} - ${formattedDate} ${formattedTime}`,
        });

        const militaninmenusu = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                .setCustomId('ticketacim')
                .setLabel(minik.ticket.menuayarlari.birseceneklabel)
                .setEmoji(minik.ticket.menuayarlari.birsecenekemoji)
                .setStyle(ButtonStyle.Success)

            );
        await interaction.reply({ content: 'Ticket oluşturma menüsü gönderiliyor...', ephemeral: true });

        await interaction.channel.send({
            embeds: [militanembed],
            components: [militaninmenusu]
        });

        openTickets.add(interaction.user.id);
        await interaction.editReply({ content: 'Ticket oluşturma menüsü gönderildi.' });
    }
};
