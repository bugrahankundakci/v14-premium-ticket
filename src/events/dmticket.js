const { Events, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    name: Events.MessageCreate,
    once: false,

    /**
     * @param {import('discord.js').Message} message
     * @param {import('discord.js').Client} client
     */
    async execute(message, client) {
        if (message.guild) {
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

                let ticketChannel = guild.channels.cache.find(channel =>
                    channel.type === ChannelType.GuildText &&
                    channel.parentId === category.id && channel.topic === `ID: ${message.author.id}`
                );

            } catch (error) {
                console.error('Bir hata oluştu:', error);
            }
        } else if (!message.author.bot) {
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

                let ticketChannel = guild.channels.cache.find(channel =>
                    channel.type === ChannelType.GuildText &&
                    channel.parentId === category.id && channel.topic === `ID: ${message.author.id}`
                );

                const minikrandom = Date.now();

                if (!ticketChannel) {
                    ticketChannel = await guild.channels.create({
                        name: minikrandom,
                        type: ChannelType.GuildText,
                        parent: category.id,
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: message.author.id,
                                allow: [
                                    PermissionsBitField.Flags.ViewChannel,
                                    PermissionsBitField.Flags.SendMessages,
                                    PermissionsBitField.Flags.ReadMessageHistory
                                ],
                            },
                            {
                                id: minik.ticket.yetkili,
                                allow: [
                                    PermissionsBitField.Flags.ViewChannel,
                                    PermissionsBitField.Flags.SendMessages,
                                    PermissionsBitField.Flags.ReadMessageHistory
                                ],
                            },
                        ],
                        topic: `ID: ${message.author.id}`,
                    });

                    const allahinembedi = new EmbedBuilder()
                        .setTitle('Dm ticket oluşturuldu.')
                        .setColor('Yellow')
                        .setDescription(`Ticketi açan kişi: \n > <@${message.author.id}> - ${message.author.tag} - (${message.author.id}) \n`);

                    const militaninbutonu = new ButtonBuilder()
                        .setCustomId('dmticketisil')
                        .setLabel('Ticketi Kapat')
                        .setEmoji('🔒')
                        .setStyle(ButtonStyle.Danger);

                    const actionRowMenu = new ActionRowBuilder().addComponents(militaninbutonu);

                    await ticketChannel.send({ content: `<@&${minik.ticket.yetkili}>`, embeds: [allahinembedi], components: [actionRowMenu] });

                    const militaninilkbutonu = new ButtonBuilder()
                        .setCustomId(`genel`)
                        .setLabel(`Genel`)
                        .setEmoji('📩')
                        .setStyle(ButtonStyle.Primary);
                    
                    const militaninikincibutonu = new ButtonBuilder()
                        .setCustomId(`hwid`)
                        .setLabel(`HWID Reset`)
                        .setEmoji('🔧')
                        .setStyle(ButtonStyle.Primary);

                    const militaninucuncubutonu = new ButtonBuilder()
                        .setCustomId(`reselling`)
                        .setLabel(`Reselling`)
                        .setEmoji('💰')
                        .setStyle(ButtonStyle.Primary);

                    const uclubuton = new ActionRowBuilder().addComponents(militaninilkbutonu, militaninikincibutonu, militaninucuncubutonu);
                    
                    const dmticket = new EmbedBuilder()
                        .setTitle(`Merhaba, ${message.author.tag}`)
                        .setColor('Yellow')
                        .setDescription(`Destek talebiniz başarıyla etkinleştirildi. Aşşağıdaki butonları kullanarak kategorinizi seçebilirsiniz.`);

                    await message.author.send({ embeds: [dmticket], components: [uclubuton] });
                }

                if (ticketChannel) {
                    const webhooks = await ticketChannel.fetchWebhooks();
                    let webhook = webhooks.find(w => w.name === 'Support Webhook');

                    if (!webhook) {
                        webhook = await ticketChannel.createWebhook({
                            name: 'Support Webhook',
                            avatar: message.author.displayAvatarURL(),
                        });
                    }

                    await webhook.send({
                        content: `${message.content}`,
                        username: message.author.username,
                        avatarURL: message.author.displayAvatarURL(),
                    });
                }

                client.on('interactionCreate', async interaction => {
                    try {
                        if (!interaction.isButton()) return;

                        if (interaction.customId === 'genel' || interaction.customId === 'hwid' || interaction.customId === 'reselling') {
                            await ticketChannel.setName(interaction.customId);
                            await interaction.reply({ content: `Seçim başarıyla onaylandı`, ephemeral: true });
    
    
                            const updatedDMEmbed = new EmbedBuilder()
                                .setTitle(`Ticket başlığı güncellendi`)
                                .setColor('Green')
                                .setDescription(`Kanal adı başarıyla şu şekilde değiştirildi: **${interaction.customId}**.`);
    
                            try {
                                const userDM = await interaction.user.dmChannel.messages.fetch();
                                const dmMessage = userDM.find(msg => msg.embeds.length > 0 && msg.embeds[0].title === `Merhaba, ${interaction.user.tag}`);
    
                                if (dmMessage) {
                                    await dmMessage.edit({ embeds: [updatedDMEmbed], components: [] });
                                }
                            } catch (err) {
                                console.error('DM mesajı güncellenirken hata oluştu:', err);
                            }
                        }

                    } catch (error) {
                        console.log('ticket kapandığı için butonlar aktif değil')
                    }

                });


            } catch (error) {
                console.error('Bir hata oluştu:', error);
            }
        }
    },
};
