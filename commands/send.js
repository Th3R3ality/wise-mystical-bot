const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("send")
        .setDescription("sends a message to the minecraft server"),
    
    async execute(interaction) {
        await interaction.reply("sent message");
    },
};