const { GuildMember, ApplicationCommandOptionType } = require('discord.js');
const { QueryType, useQueue, useMainPlayer } = require('discord-player');
const { isInVoiceChannel } = require("../utils/voicechannel");

module.exports = {
    name: 'playtop',
    description: 'Putar musik sebelum musik selanjutnya yang ada pada queue.',
    options: [
        {
            name: 'query',
            type: ApplicationCommandOptionType.String,
            description: 'Musik yang dimainkan.',
            required: true,
        },
    ],
    async execute(interaction) {
        try {
            const inVoiceChannel = isInVoiceChannel(interaction)
            if (!inVoiceChannel) {
                return
            }

            await interaction.deferReply();

            const player = useMainPlayer()
            const query = interaction.options.getString('query');
            const searchResult = await player
                .search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO,
                })
                .catch(() => {
                });
            if (!searchResult || !searchResult.tracks.length)
                return void interaction.followUp({ content: 'Tidak ada hasil yang muncul.' });

            const queue = useQueue(interaction.guild.id)

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                return void interaction.followUp({
                    content: 'Tidak bisa join channel.',
                });
            }

            await interaction.followUp({
                content: `⏱ | Loading your ${searchResult.playlist ? 'playlist' : 'track'}...`,
            });
            searchResult.playlist ? queue.node.insert(searchResult.tracks, 0) : queue.node.insert(searchResult.tracks[0], 0);
            if (!queue.currentTrack) await player.play();
        } catch (error) {
            console.log(error);
            await interaction.followUp({
                content: 'Terjadi error ketika menjalankan command : ' + error.message,
            });
        }
    },
};
