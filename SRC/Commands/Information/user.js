const {
    EmbedBuilder,
    SlashCommandBuilder,
    Client,
    ChatInputCommandInteraction,
} = require("discord.js");
const { colour } = require("../../config.json");
const moment = require("moment");
const axios = require("axios");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("user-info")
        .setDescription("Replies an embed containing user information")
        .addUserOption((options) =>
            options.setName("user").setDescription("The user")
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute: async (interaction, client) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const User = interaction.guild.members.cache.get(user.id);

        let Roles = User.roles.cache;

        let info1 = new EmbedBuilder()
            .setTitle("General Information")
            .setThumbnail(
                `${user.avatarURL({
                    dynamic: true,
                    size: 4096,
                })}`
            )
            .setDescription(
                `**🪧 Name : ${User.displayName} | ${user}\n🏷️ Tag : __${user.tag}__\n🆔 ID : __${user.id}__**`
            )
            .addFields(
                {
                    name: "Joined Server",
                    value: `${moment(User.joinedAt).format(
                        "dddd, MMMM Do YYYY, h:mm:ss A"
                    )}\n** - ${moment(User.joinedAt, "YYYYMMDD").fromNow()}**`,
                },
                {
                    name: "Joined Discord",
                    value: `${moment(user.createdAt).format(
                        "dddd, MMMM Do YYYY, h:mm:ss A"
                    )}\n** - ${moment(user.createdAt, "YYYYMMDD").fromNow()}**`,
                }
            );

        let info2 = new EmbedBuilder()
            .setTitle(`Roles [${Roles.size - 1}]`)
            .setDescription(
                `**${User.roles.cache
                    .map((r) => r)
                    .join("\n")
                    .replace("@everyone", " ")}**`
            );

        axios
            .get(`https://discord.com/api/users/${user.id}`, {
                headers: {
                    Authorization: `Bot ${client.token}`,
                },
            })
            .then((res) => {
                const {
                    id,
                    discriminator,
                    avatar,
                    banner,
                    accent_color,
                    username,
                    banner_color,
                } = res.data;

                if (banner) {
                    const extension = banner.startsWith("a_") ? ".gif" : ".png";
                    const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}`;

                    info1.setColor(User.displayHexColor).setImage(url);
                    info2.setColor(User.displayHexColor);

                    interaction.reply({
                        embeds: [info1, info2],
                    });
                } else if (banner_color) {
                    info1.setColor(banner_color);
                    info2.setColor(banner_color);

                    interaction.reply({
                        embeds: [info1, info2],
                    });
                } else {
                    info1.setColor(User.displayHexColor);
                    info2.setColor(User.displayHexColor);

                    interaction.reply({
                        embeds: [info1, info2],
                    });
                }
            });
    },
};
