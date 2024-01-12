const { ApplicationCommandOptionType } = require('discord.js');

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

        interaction.reply({
            content: `Name: ${user.username}, ID: ${user.id}, Avatar: ${user.displayAvatarURL({ dynamic: true })}`,
            ephemeral: true,
        });
    },
};
