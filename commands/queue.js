const { GuildMember } = require('discord.js');
const { useQueue } = require("discord-player");
const { isInVoiceChannel } = require("../utils/voicechannel");

module.exports = {
    name: 'queue',
    description: 'Nampilin queue musik.',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction)
        if (!inVoiceChannel) {
            return
        }

        const queue = useQueue(interaction.guild.id)
        if (typeof (queue) != 'undefined') {
            const trimString = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

            let queueStr = `🎶 |  **Lagu-lagu selanjutnya:**\n`

            queue.tracks.data.forEach((track, index) => {
                queueStr += `${index + 1}. ${track.title}\n`;
            });

            return void interaction.reply({
                embeds: [
                    {
                        title: `Now Playing 🎶 |  **${queue.currentTrack.title}**`,
                        description: trimString(`**${trimString(queueStr, 4095)}**\n`),
                    }
                ],
                ephmeral: true
            })
        } else {
            return void interaction.reply({
                content: 'Lagi ga ada musik di queue.'
            })
        }
    }
}
