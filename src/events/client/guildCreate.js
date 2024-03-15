const Discord = require('discord.js');

const Functions = require("../../database/models/functions");

module.exports = async (client, guild) => {
  const webhookClient = new Discord.WebhookClient({
    id: client.webhooks.serverLogs.id,
    token: client.webhooks.serverLogs.token,
  });

  if (guild == undefined) return;

  new Functions({
    Guild: guild.id,
    Prefix: client.config.discord.prefix
  }).save();

  try {
    const embed = new Discord.EmbedBuilder()
      .setTitle("<:join:1218214506547904533>・Added to a new server!")
      .addFields(
        { name: "Total Servers:", value: `> ${client.guilds.cache.size}`, inline: false },
        { name: "Server Name", value: `> ${guild.name}`, inline: false },
        { name: "Server ID", value: `> ${guild.id}`, inline: false },
        { name: "Server Members", value: `> ${guild.memberCount}`, inline: false },
        { name: "Server Swner", value: `> <@!${guild.ownerId}> (${guild.ownerId})`, inline: false },
      )
      .setThumbnail("https://media.discordapp.net/attachments/1162368760754208882/1187340370867134574/light.png")
      .setImage('https://media.discordapp.net/attachments/1162368760754208882/1218211794905071676/yh.png')
      .setColor(client.config.colors.normal)
    webhookClient.send({
      username: 'Bot Logs',
      avatarURL: client.user.avatarURL(),
      embeds: [embed],
    });


    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
      if (channel.type == Discord.ChannelType.GuildText && defaultChannel == "") {
        if (channel.permissionsFor(guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
          defaultChannel = channel;
        }
      }
    })

    let row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setLabel("Invite")
          .setURL(client.config.discord.botInvite)
          .setStyle(Discord.ButtonStyle.Link),

        new Discord.ButtonBuilder()
          .setLabel("Support Server")
          .setURL(client.config.discord.serverInvite)
          .setStyle(Discord.ButtonStyle.Link),

          new Discord.ButtonBuilder()
          .setLabel("Website")
          .setURL("https://yokihost.com/")
          .setStyle(Discord.ButtonStyle.Link),
      );

    client.embed({
      title: "Thanks for Choosing us!!",
      image: "https://media.discordapp.net/attachments/1162368760754208882/1218211794905071676/yh.png",
      fields: [{
        name: "<:que:1218205537699758182><:arrow_r:1218169812199542904>How to Setup?",
        value: '> The default prefix: / (slash).\n> Use setups by running: /setup help!',
        inline: false,
      },
      {
        name: "📨┆Invite the bot!",
        value: `Invite the bot to click [[HERE]](${client.config.discord.botInvite})`,
        inline: false,
      },
      ],
      components: [row],
    }, defaultChannel)
  }
  catch (err) {
    console.log(err);
  }

};
