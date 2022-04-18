const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Message } = require('discord.js');

const admin = require("firebase-admin")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("homework")
        .setDescription("Check what homework there is"),
    async execute(interaction) {
        console.log("hello")
        guildID = interaction.guildId
        var db = admin.database();
        var ref = db.ref("/");
        var homework = null
        await ref.once("value", function (snapshot) {
            for (i in snapshot.val()) {
                if (i == guildID) {
                    snapshot = snapshot.val()
                    const snapshotJson = JSON.parse(JSON.stringify(snapshot))
                    homework = snapshotJson[i]
                }
            }
        });
        var embed = new MessageEmbed()
            .setTitle("Homework")
        if (homework == "NIL") {
            embed.setDescription("This server does not have any homework currenty. Run `/add` to add the first homework!")
                .setTimestamp()
                .setColor("#008000")
                .setFooter({ text: 'Homework', iconURL: 'https://cdn.discordapp.com/avatars/939788620917792810/fe8e6ab1feed949af68d0e74b487cd31.webp?size=128' });
        } else {
            listOfHomework = []
            for (i in homework) {
                if (i == "users"){
                    continue
                }
                const homeworkName = homework[i]['name']
                const dueDate = new Date(homework[i]['duedate'])
                const optional = homework[i]['optional']
                var submitted = homework[i]['submitted']
                const shortId = homework[i]['shortId']
                if (submitted == "null") {
                    submitted = false
                } else {
                    for (x in submitted){
                        if (submitted[x] == interaction.user.id.toString()){
                            submitted = true
                        } else {
                            console.log(submitted[x], interaction.user.id.toString())
                            submitted = false
                        }
                    }
                }
                listOfHomework.push([homeworkName, dueDate, optional, submitted, shortId])
            }
            notDoneToday = []
            notDone = []
            overdue = []
            completed = []
            for (x in listOfHomework) {
                if (listOfHomework[x][3] == true) {
                    completed.push(listOfHomework[x])
                } else if (listOfHomework[x][1] - Date.now() < 8.64e+7) {
                    notDoneToday.push(listOfHomework[x])
                } else if (listOfHomework[x][1 - Date.now() < 0]) {
                    overdue.push(listOfHomework[x])
                } else {
                    notDone.push(listOfHomework[x])
                }
            }
            homeworkSort = [overdue, notDoneToday, notDone, completed]
            homeworkSortText = ["", "", "", ""]
            for (var i = 0; i < 4; i++) {
                if (homeworkSort[i].length == 0) {
                    homeworkSortText[i] = "None"
                } else {
                    for (x in homeworkSort[i]) {
                        console.log(homeworkSort[i][x][1].toDateString())
                        homeworkSortText[i] += (parseInt(x) + 1).toString() + ". " + homeworkSort[i][x][0] + " ***(Due " + homeworkSort[i][x][1].toDateString() + ")*** `" + homeworkSort[i][x][4] + "`"
                        if (homeworkSort[i][x][2] == true) {
                            homeworkSortText[i] += " [Optional]"
                        }
                        homeworkSortText[i] += "\n"
                    }
                }
            }

            embed.setDescription("Here is the list of homework, \nRun `/done` to complete the homework with the 3 character ID (Case sensitive)")
                .setColor('#0099ff')
                .setFooter({ text: 'Homework', iconURL: 'https://cdn.discordapp.com/avatars/939788620917792810/fe8e6ab1feed949af68d0e74b487cd31.webp?size=128' })
                .setTimestamp()
                .addField('Overdue', homeworkSortText[0])
                .addField('Due Today', homeworkSortText[1])
                .addField('Not Done', homeworkSortText[2])
                .addField('Completed', homeworkSortText[3])
        }

        await interaction.reply({
            embeds: [embed]
        });
    }
}