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
        const member = interaction.guild.members.cache.get(user.id);

        const wibOptions = { timeZone: 'Asia/Jakarta' };

        const userInfoEmbed = new EmbedBuilder()
            .setColor('#0349fc')
            .setTitle(`${user.bot ? user.tag : (user.globalName ? user.globalName : user.username)}'s Information`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'ID', value: user.id, inline: true },
                { name: 'Username', value: user.username, inline: true },
                { name: 'Avatar', value: `[Link](${user.displayAvatarURL({ dynamic: true })})`, inline: true },
                { name: 'Account Type', value: user.bot ? 'Bot' : 'Human', inline: true },
                { name: 'Account Created At', value: `${user.createdAt.toLocaleString('id-ID', wibOptions)} WIB`, inline: true },
                { name: 'Account Age', value: calculateAge(user.createdAt), inline: true },
                { name: 'Joined Server At', value: `${member.joinedAt.toLocaleString('id-ID', wibOptions)} WIB`, inline: true },
                { name: 'Joined Server Age', value: calculateAge(member.joinedAt), inline: true },
            )
            .setTimestamp();

        interaction.reply({
            embeds: [userInfoEmbed],
        });
    },
};

// Function to calculate age
function calculateAge(date) {
    const ageMilliseconds = Date.now() - date;
    const age = new Date(ageMilliseconds);
    return `${age.getUTCFullYear() - 1970} years, ${age.getUTCMonth()} months, ${age.getUTCDate()} days`;
}