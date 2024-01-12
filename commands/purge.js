module.exports = {
    name: 'purge',
    description: 'Menghapus beberapa pesan terakhir di seluruh chat channel.',
    options: [
        {
            name: 'num',
            type: 4, //'INTEGER' Type
            description: 'Banyak pesan yang ingin dihapus. (max 100)',
            required: true,
        },
    ],
    async execute(interaction) {
        const deleteCount = interaction.options.get('num').value;

        if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
            return void interaction.reply({
                content: `Angka yang dimasukkan harus 2 <= 100.`,
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
                    content: `Berhasil menghapus pesan.`,
                    ephemeral: true,
                });
            })
            .catch(error => {
                interaction.reply({
                    content: `Tidak dapat menghapus pesan karena : ${error}`,
                    ephemeral: true,
                });
            });
    },
};
