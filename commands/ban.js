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
            console.log('Gagal mem-ban karena member tidak dimention.');
            return interaction.reply('Buat ngeban member ini, lu harus mention dia.');
        }

        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            console.log('Gagal mem-ban member.');
            return interaction.reply("Gabisa ban ni member.");
        }

        const userinfo = client.users.cache.getMember(member);

        return interaction.guild.members
            .ban(member)
            .then(() => {
                console.log(`${userinfo.username} telah di-ban.`);
                interaction.reply({
                    content: `${userinfo.username} telah di-ban.`,
                    ephemeral: true,
                });
            })
            .catch(error => {
                console.log(`Terjadi error : ${error}`);
                interaction.reply({
                    content: `Terjadi error : ${error}`,
                    ephemeral: true,
                })
            },
            );
    },
};
