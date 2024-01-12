const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Ban member.',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'Nama member yang mau diban.',
            required: true,
        },
    ],
    execute(interaction, client) {
        const member = interaction.options.getUser('user');

        if (!member) {
            return interaction.reply('Buat ngeban member ini, lu harus mention dia.');
        }

        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply("Gabisa ban ni member.");
        }

        const userinfo = client.users.cache.getMember(member);

        return interaction.guild.members
            .ban(member)
            .then(() => {
                interaction.reply({
                    content: `${userinfo.username} telah di-ban.`,
                    ephemeral: true,
                });
            })
            .catch(error =>
                interaction.reply({
                    content: `Terjadi error.`,
                    ephemeral: true,
                }),
            );
    },
};
