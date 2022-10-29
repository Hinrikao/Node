const {
    EmbedBuilder,
    SlashCommandBuilder
} = require("discord.js");
const moment = require("moment");
const {
    colour
} = require("../../config.json");





module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName("server-info")
    .setDescription("Replies with server information."),
    execute: async(interaction, client) => {
        let Guild = interaction.guild
        let Roles = Guild.roles.cache;
        let owner = await Guild.members.cache.get(Guild.ownerId);
        let Members = await Guild.members.fetch();
        let Channels = await Guild.channels.fetch();
      
  
      
        let server = new EmbedBuilder()
        .addFields(
            {
                name: "🏛️ Name",
                value: `${Guild.name}`,
            },
            {
                name: "🆔 ID",
                value: `${Guild.id}`,
            },
            {
                name: "📅 Created On",
                value: `${moment(Guild.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss A")}\n- ${moment(Guild.createdAt, "yyMMdd").fromNow()}`
            },
            {
                name: "👑 Owned by",
                value: `${owner}`
            },
            {
                name: `👥 Members [${Guild.memberCount}]`,
                value: "More information will be added in next Update."
            },
            {
                name: `💬 Channels [${Channels.size}]`,
                value: "More information will be added in the next update."
            },
            {
                name: `🔐 Roles [${Roles.size}]`,
                value: "Use \`/roles\` to get a list of roles"
            }
        )
        .setColor(colour.main)
        .setThumbnail(`${Guild.iconURL({
            dynamic: true,
            size: 4096
        })}`)
        
        interaction.reply({
            embeds: [server]
        });
    }
};