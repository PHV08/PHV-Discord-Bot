const { Client, Message, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Help Commands',
    aliases: ['h'],
    emoji: '❓',
    userperm: ['SEND_MESSAGES'],
    botperm: ['SEND_MESSAGES'],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        try {
            const emojis = {
                config: '⚙️',
                developer: '🔧',
                fun: '😅',
                games: '🎮',
                guild: '📫',
                info: 'ℹ️',
                levelling: '⏫',
                moderation: '⚒️',
                owner: '👑',
                search: '🔍',
                user: '👤',
                utility: '📀',
                welcoming: '👋',
            };
            const directories = [...new Set(client.commands.map(cmd => cmd.directory))];
            const formatString = str => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

            const categories = directories.map(dir => {
                const getCommands = client.commands
                    .filter(cmd => cmd.directory === dir)
                    .map(cmd => {
                        return {
                            name: cmd.name || 'No Name',
                            description: cmd.description || 'No Description Provided',
                            emoji: cmd.emoji || '',
                        };
                    });

                return {
                    directory: formatString(dir),
                    commands: getCommands,
                };
            });

            const color = message.guild.me.displayHexColor;

            const supportServerLink = 'https://discord.gg/UV22V6fEAv';
            const githubLink = 'https://github.com/PHV08/Discord-MusicBot-5';
            const youtubeLink = 'https://www.youtube.com/channel/UCGTbFucVXPA9OBTUPZj-TzQ';

            const embed = new MessageEmbed()
                .setTitle('PHV Help Desk')
                .setThumbnail(client.user.displayAvatarURL({ size: 512 }))
                .setDescription(
                    `Please choose a category in the Dropdown menu!\n\nMade with 💖 and Discord.js\n\n[Support Server](${supportServerLink}) | [GitHub](${githubLink}) | [YouTube](${youtubeLink})`
                )
                .setColor(color);

            const components = state => [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId('help-menu')
                        .setPlaceholder('Please select a category')
                        .setDisabled(state)
                        .addOptions(
                            categories.map(cmd => {
                                return {
                                    label: cmd.directory,
                                    value: cmd.directory.toLowerCase(),
                                    description: `Commands from ${cmd.directory} category`,
                                    emoji: { name: emojis[cmd.directory.toLowerCase()] || null },
                                };
                            })
                        )
                ),
            ];

            const initialMessage = await message.channel.send({
                embeds: [embed],
                components: components(false),
            });

            const filter = interaction => interaction.user.id === interaction.member.user.id;

            const collector = message.channel.createMessageComponentCollector({
                filter,
                componentType: 'SELECT_MENU',
            });

            collector.on('collect', interaction => {
                const [directory] = interaction.values;
                const category = categories.find(x => x.directory.toLowerCase() === directory);

                const categoryEmbed = new MessageEmbed()
                    .setTitle(`${emojis[directory.toLowerCase()]} ${formatString(directory)} Commands`)
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: 512 }))
                    .setDescription(`Here are the list of commands!`)
                    .setColor(color)
                    .addFields(
                        category.commands.map(cmd => {
                            return {
                                name: `${cmd.emoji} \`${cmd.name}\``,
                                value: cmd.description,
                                inline: true,
                            };
                        })
                    )
                    .setTimestamp();

                interaction.update({ embeds: [categoryEmbed] });
            });
        } catch (err) {
            console.log(err);
            message.channel.send({
                content: 'Uh oh! Something unexpected happened. Try running the command again!',
            });
        }
    },
};

