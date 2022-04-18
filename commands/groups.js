const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Message } = require('discord.js');

const admin = require("firebase-admin")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("group")
        .setDescription("Groupings")
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription("Add a group")
                .addStringOption(option => option.setName('name').setDescription('Name of group').setRequired(true))
                .addUserOption(option => option.setName('member').setDescription('1st member you want to add').setRequired(true))
                .addUserOption(option => option.setName('member2').setDescription('2nd member you want to add'))
                .addUserOption(option => option.setName('member3').setDescription('3rd member you want to add'))
                .addUserOption(option => option.setName('member4').setDescription('4th member you want to add'))
                .addUserOption(option => option.setName('member5').setDescription('5th member you want to add')))
        .addSubcommand(subcommand=>
            subcommand
            .setName("delete")
            .setDescription("Delete a group")),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'add') {
            console.log(interaction.options.getMember("member") == interaction.member)
            console.log(interaction.member)
            members = ["member", "member2", "member3", "member4", "member5"]

            //Check if member is interaction user
            for (x in members) {
                if (interaction.options.getMember(members[x]) == interaction.member) {
                    await interaction.reply({
                        content: "Member must not be you",
                        ephemeral: true,
                    })
                    return
                }
            }

            //Creating and adding roles
            const role = await interaction.guild.roles.create({
                name: interaction.options.getString("name"),
            })
            interaction.member.roles.add(role)
            for (x in members) {
                if (interaction.options.getMember(members[x]) != null) { interaction.options.getMember(members[x]).roles.add(role) }
            }

            //Creating channels
            const category = await interaction.guild.channels.create(interaction.options.getString("name"), {
                type: "GUILD_CATEGORY",
                permissionOverwrites: [
                    {
                        id: role.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],

                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                    }
                ],
            })
            const channel = await interaction.guild.channels.create(interaction.options.getString("name"), {
                type: "text",
                permissionOverwrites: [
                    {
                        id: role.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],

                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                    }
                ],
            })
            const voice = await interaction.guild.channels.create(interaction.options.getString("name"), {
                type: 'GUILD_VOICE',
                permissionOverwrites: [
                    {
                        id: role.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],

                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                    }
                ],
            })
            channel.setParent(category.id)
            voice.setParent(category.id)
        } else if (interaction.options.getSubcommand() === 'delete') {
            
        }
    }
}