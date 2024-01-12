module.exports = {
    name: 'purge',
    description: 'Ngehapus beberapa pesan terakhir di seluruh text channel.',
    options: [
        {
            name: 'num',
            type: 4, //'INTEGER' Type
            description: 'Banyak pesan yang mau dihapus. (max 100)',
            required: true,
        },
    ],
    async execute(interaction) {
        const deleteCount = interaction.options.get('num').value;

        if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
            return void interaction.reply({
                content: `Angka yang dimasukkan di jangkauan 2 - 100.`,
                ephemeral: true,
            });
        }

        const fetched = await interaction.channel.messages.fetch({
            limit: deleteCount,
        });

        interaction.channel
            .bulkDelete(fetched)
            .then(() => {
                interaction.reply({
                    content: `Message berhasil dihapus.`,
                    ephemeral: true,
                });
            })
            .catch(error => {
                interaction.reply({
                    content: `Gagal menghapus pesan karena : ${error}`,
                    ephemeral: true,
                });
            });
    },
};
