const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Message } = require('discord.js');

const admin = require("firebase-admin")

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add a homework to the list")
        .addStringOption(option => option.setName('name').setDescription('Name of homework').setRequired(true))
        .addStringOption(option => option.setName('duedate').setDescription('Due Date of homework (Month/Day/Year) Eg.02/28/2022').setRequired(true))
        .addBooleanOption(option => option.setName('optional').setDescription('Is the homework optional? (Default: false)')),
    async execute(interaction) {
        date = new Date(interaction.options.getString("duedate"))
        if (date.toString() != "Invalid Date") {
            now = new Date()
            todaydate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            if (date - todaydate >= 0) {
                uniqueID = makeid(8)
                var db = admin.database();
                var ref = db.ref(`/${interaction.guildId}/${uniqueID}`)
                optional = false
                if (interaction.options.getBoolean("optional") != null) {
                    optional = interaction.options.getBoolean("optional")
                }
                ref.update({
                    name: interaction.options.getString("name").trim(),
                    duedate: date,
                    submitted: "null",
                    optional: optional,
                    shortId: makeid(3)
                })
                embed = new MessageEmbed()
                    .setTitle("Success")
                    .setDescription("Homework successfully added. Run `/homework` to check all the homework")
                    .setTimestamp()
                    .setColor("#008000")
                    .setFooter({ text: 'Homework', iconURL: 'https://cdn.discordapp.com/avatars/939788620917792810/fe8e6ab1feed949af68d0e74b487cd31.webp?size=128' });
                await interaction.reply({
                    embeds: [embed]
                });
            } else {
                console.log(todaydate)
                console.log(date - todaydate)
                embed = new MessageEmbed()
                    .setTitle("Date Error")
                    .setDescription("The date you have input is before today. Please input a date that is after today")
                    .setTimestamp()
                    .setColor("#ff0000")
                    .setFooter({ text: 'Homework', iconURL: 'https://cdn.discordapp.com/avatars/939788620917792810/fe8e6ab1feed949af68d0e74b487cd31.webp?size=128' });
                await interaction.reply({
                    embeds: [embed], 
                    ephemeral: true
                });
            }

        } else {
            embed = new MessageEmbed()
                .setTitle("Date Error")
                .setDescription("The date you have input is invalid. Please follow the guidelines on how to input the date \n`Month/Day/Year` \nEg.`02/28/2022`(28th of Feb 2022)")
                .setTimestamp()
                .setColor("#ff0000")
                .setFooter({ text: 'Homework', iconURL: 'https://cdn.discordapp.com/avatars/939788620917792810/fe8e6ab1feed949af68d0e74b487cd31.webp?size=128' });

            await interaction.reply({
                embeds: [embed]
            });
        }
    }
}