require("dotenv").config();
const { REST, Routes } = require("discord.js");
const colors = require("colors");
const token = process.env["DISCORD_CLIENT_TOKEN"];
const clientId = process.env["DISCORD_CLIENT_ID"];
const serverId = process.env["SERVER_ID"];
const readline = require("readline");
const rest = new REST({ version: 10 }).setToken(token);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const warningMsg =
  colors.yellow(`----------------------------------- !!! WARNING !!! -----------------------------------
This script will delete every guild slash & context menu command of your discord bot.
Do you want to continue? (y/n): `);

console.clear();
rl.question(warningMsg, async function (name) {
  try {
    if (name.toLowerCase() === "y") {
      await deleteCommands();
      process.exit(0);
    } else {
      console.log(colors.red("Canceled the deletion."));
      process.exit(0);
    }
  } catch (error) {
    console.log(colors.red(error?.stack ? error?.stack : error));
    process.exit(1);
  }
});

async function deleteCommands() {
  const guild = await rest.get(Routes.guild(serverId));
  const commands = await rest.get(Routes.applicationGuildCommands(clientId, serverId));

  if (commands?.length === 0) {
    return console.log(
      colors.red(
        `❗ Couldn't fing any guild command in ${colors.underline(guild.name)}.`,
      ),
    );
  }

  console.log(
    colors.cyan(
      `✅ Found ${commands.length} guild commands in ${colors.underline(guild.name)}.\n`,
    ),
  );

  let i = 0;
  commands.forEach((command) => {
    i++;
    console.log(
      colors.yellow(
        `${i >= 100 ? "" : i >= 10 ? " " : "  "}${i} | 🔥 Deleted command - ${
          command.id
        } - ${command.name} `,
      ),
    );
  });

  await rest.put(Routes.applicationGuildCommands(clientId, serverId), {
    body: [],
  });

  return console.log(
    colors.green(`\n✅ Deleted ${i} commands in ${colors.underline(guild.name)}.`),
  );
}
