const { SlashCommandBuilder, CommandInteractionOptionResolver } = require("discord.js");
const { Socket } = require("net");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("send")
        .setDescription("sends a message to the minecraft server")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("message to send")
                .setRequired(true)),
    
    async execute(interaction, sock) {
        if (sock.pending == false && sock.destroyed == false){
            const message = interaction.options.getString("message");
            sock.write(interaction.user.tag + ": " + message + "\n");
            await interaction.reply({ content: `sent message: ${message}`, ephemeral: true });
        } else {
            await interaction.reply({ content: `couldn't send message: no open connection to minecraft`, ephemeral: true });
        }
    },
};