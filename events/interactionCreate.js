const admin = require("firebase-admin");
const ready = require("./ready");

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        var db = admin.database();
        var ref = db.ref(`/${interaction.guild.id}/users`);
        await ref.once("value", function (snapshot) {
            if (snapshot.val() != null) {
                if (!snapshot.val().includes(interaction.user.id)) {
                    console.log(snapshot.val())
                    var ref2 = db.ref(`/${interaction.guild.id}`)

                    people = snapshot.val()
                    people.push(interaction.user.id)
                    ref2.set({
                        users: people
                    })
                }
            } else {
                var ref2 = db.ref(`/${interaction.guild.id}`)
                console.log(snapshot.val())
                ref2.set({
                    users: [interaction.user.id]
                })
            }
        })
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (err) {
            if (err) console.log(err);

            await interaction.reply({
                content: "An error occurred",
                ephemeral: true
            })
        }
    }
}