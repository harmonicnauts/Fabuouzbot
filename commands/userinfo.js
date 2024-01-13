
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Nampilin informasi dari user / member.',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'User / member yang mau dilihat info nya.',
            required: true,
        },
    ],
    execute(interaction, client) {
        const user = interaction.options.getUser('user');
        const userInfoEmbed = new EmbedBuilder()
            .setColor('#0349fc')
            .setTitle(`${user.globalName}'s Information`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                // { name: '\u200B', value: '\u200B' },
                { name: 'ID', value: user.id, inline: true },
                { name: 'Username', value: user.username, inline: true },
                { name: 'Avatar', value: `[Link](${user.displayAvatarURL({ dynamic: true })})`, inline: true },
                { name: 'Account Type', value: user.bot ? 'Bot' : 'Human', inline: true },
            )
            .setTimestamp()
        interaction.reply({
            // content: `Name: ${user.username}, ID: ${user.id}, Avatar: ${user.displayAvatarURL({ dynamic: true })}`,
            embeds: [userInfoEmbed],
        });
    },
};
