const { GuildMember, ApplicationCommandOptionType } = require('discord.js');
const { useQueue } = require("discord-player");
const { isInVoiceChannel } = require("../utils/voicechannel");

module.exports = {
    name: 'move',
    description: 'Mindahin posisi musik di queue.',
    options: [
        {
            name: 'track',
            type: ApplicationCommandOptionType.Integer,
            description: 'Track yang mau dipindahin.',
            required: true,
        },
        {
            name: 'position',
            type: ApplicationCommandOptionType.Integer,
            description: 'Posisi tujuan pemindahan track.',
            required: true,
        },
    ],
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction)
        if (!inVoiceChannel) {
            return
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id)

        if (!queue || !queue.currentTrack)
            return void interaction.followUp({ content: '❌ | Tidak ada musik yang dimainkan.' });

        const queueNumbers = [interaction.options.getInteger('track') - 1, interaction.options.getInteger('position') - 1];

        if (queueNumbers[0] > queue.tracks.size || queueNumbers[1] > queue.tracks.size)
            return void interaction.followUp({ content: '❌ | Posisi tujuan engga boleh lebih besar dari besar queue.' });

        try {
            const track = queue.node.remove(queueNumbers[0]);
            queue.node.insert(track, queueNumbers[1]);
            return void interaction.followUp({
                content: `✅ | Telah memindahkan **${track}**!`,
            });
        } catch (error) {
            console.log(error);
            return void interaction.followUp({
                content: '❌ | Terjadi kesalahan.',
            });
        }
    },
};
