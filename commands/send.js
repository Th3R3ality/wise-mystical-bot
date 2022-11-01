const { SlashCommandBuilder, CommandInteractionOptionResolver } = require("discord.js");

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
        const message = interaction.options.getString("message");
        await interaction.reply({ content: `sent message: ${message}`, ephemeral: true });
    },
};