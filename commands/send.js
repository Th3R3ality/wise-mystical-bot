const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("send")
        .setDescription("sends a message to the minecraft server")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("message to send")
                .setRequired(true)),
    
    async execute(interaction) {
        await interaction.reply({ content: "sent nothing because command functionality hasn't been implemented yet :)", ephemeral: true });
    },
};