const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Message } = require('discord.js');

const admin = require("firebase-admin")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("done")
        .setDescription("Mark a homework as complete")
        .addStringOption(option => option.setName('id').setDescription('ID of homework (Case sensitive)').setRequired(true)),
    async execute(interaction) {
        guildID = interaction.guildId
        var db = admin.database();
        var ref = db.ref(`/${guildID}`);
        if (interaction.options.getString("id").length == 3) {
            await ref.once("value", async function (snapshot) {
                deletionID = ""
                for (x in snapshot.val()) {
                    console.log(x)
                    snapshotval = await snapshot.val()
                    const snapshotJson = JSON.parse(JSON.stringify(snapshotval))
                    if (snapshotJson[x]['shortId'] === interaction.options.getString("id")) {
                        deletionID = x
                    }
                    console.log(snapshotJson[x]['shortId'], interaction.options.getString("id"))
                }
                
            })
            if (deletionID != "") {
                ref = db.ref(`/${guildID}/${deletionID}/`)
                await ref.once("value", async function (snapshot) {
                    submitted = snapshot.val().submitted
                    
                })
                if (submitted == "null"){
                    submitted = [interaction.user.id]
                    await ref.update({
                        submitted: submitted
                    })
                } else {
                    if (!submitted.includes(interaction.user.id)){
                        submitted.push(interaction.user.id)
                        await ref.update({
                            submitted: submitted
                        })
                    }
                    var embed = new MessageEmbed()
                        .setTitle("Completed")
                        .setDescription("Successfully completed homework. Good Job!")
                        .setTimestamp()
                        .setColor("#008000")
                        .setFooter({ text: 'Homework', iconURL: 'https://cdn.discordapp.com/avatars/939788620917792810/fe8e6ab1feed949af68d0e74b487cd31.webp?size=128' });
                        
                    await interaction.reply({
                        embeds: [embed]
                    })
                    ref = db.ref(`/${guildID}/users/`)
                    await ref.once("value", async function (snapshot) {
                        for (x in snapshot.val()){
                            console.log(x)
                            if (!submitted.includes(snapshot.val()[x])){
                                del = false
                                return
                            }
                        }
                        del = true
                    })
                    if (del){
                        console.log(true)
                        const delay = ms => new Promise(res => setTimeout(res, ms));
                        await delay(8.64e+7);
                        console.log("times up")
                        await ref.once("value", async function (snapshot) {
                            await ref.once("value", async function (snapshot) {
                                for (x in snapshot.val()){
                                    if (!submitted.includes(snapshot.val()[x])){
                                        return
                                    }
                                }
                                console.log("deleting")
                                console.log(deletionID)
                                ref2 = db.ref(`/${guildID}/${deletionID}`)
                                await ref2.remove()
                            })
                        })
                    }
                }
            } else {
                await interaction.reply({
                    content: "Invalid ID! Run `/homework` to check the homework's id",
                    ephemeral: true
                })
            }
        } else {

        }
    }
}