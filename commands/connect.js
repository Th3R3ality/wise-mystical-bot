const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("connect")
        .setDescription("tries to connect to the minecraft server"),
    
    async execute(interaction, sock) {
        if (sock.remoteAddress == undefined) {
            sock.connect(1337, 'localhost', () => {
                sock.write('Hello, server! Love, wise_client.\n');
                console.log('wise_client: connected');
                interaction.reply({ content: `succesfully connected`, ephemeral: true });
            });
        } else if (sock.destroyed == true){
            await interaction.reply({ content: `connection socket has been destroyed`, ephemeral: true });
        } else {
            await interaction.reply({ content: `already connected`, ephemeral: true });
        }
    },
};