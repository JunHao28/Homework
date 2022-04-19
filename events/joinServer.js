const admin = require("firebase-admin")

module.exports = {
    name: "guildCreate",
    async execute(guild){
        guildID = await guild.id
        var db = admin.database();
        var ref = db.ref('/');
        test = await guild.members.fetch()
        ref.update({
            [guildID]: 'NIL'
        });
    }
}