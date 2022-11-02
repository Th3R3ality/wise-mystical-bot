const { SlashCommandBuilder, CommandInteractionOptionResolver } = require("discord.js");
const net = require("net");

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
        const message = interaction.options.getString("message");
        sock.write(interaction.user.tag + ": " + message + "\n");
        await interaction.reply({ content: `sent message: ${message}`, ephemeral: true });
    },
};