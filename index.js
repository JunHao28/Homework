// const Discord = require("discord.js")
const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js")
require("dotenv").config()
const admin = require("firebase-admin")

//Firebase
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://homework-59acb-default-rtdb.firebaseio.com"
});

// var db = admin.database();
// var ref = db.ref("/");
// ref.once("value", function(snapshot) {
//   console.log(snapshot.val());
// });


//Discord
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
})

//Bot commands
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const commands = []
client.commands = new Collection();
for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

//Events 
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const event = []
for (const file of eventFiles){
    const event = require(`./events/${file}`);
    
    if (event.once){
        client.once(event.name, (...args) => event.execute(...args, commands));
    } else {
        client.on(event.name, (...args) => event.execute(...args, commands));
    }
}
    
//Login
client.login(process.env.TOKEN);