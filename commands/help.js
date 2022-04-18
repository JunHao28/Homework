const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Message } = require('discord.js');

const admin = require("firebase-admin")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get information about the command"),
    async execute(interaction){
        
    }
}