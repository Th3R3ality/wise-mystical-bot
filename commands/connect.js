const { SlashCommandBuilder, CommandInteractionOptionResolver } = require("discord.js");
const net = require("net");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("connect")
        .setDescription("tries to connect to the minecraft server"),
    
    async execute(interaction, sock) {
        const message = interaction.options.getString("message");
        connected = false;
        sock.connect(1337, 'localhost', function() {
            console.log('Connected');
            connected = true;
            wise_client.write('Hello, server! Love, wise_client.\n');
        });
        if (connected)
            await interaction.reply({ content: `succesfully connected to wise_client`, ephemeral: true });
    },
};