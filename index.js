require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN; // ✅ pulls from env

// 🔐 Your bot token
const TOKEN = 'TOKEN';

// 🔗 User ID to card mapping
const userCards = {
  '565615037180542976': 'txmso.png',
  '889612183447674941': 'yfel.png',
  '805125901410893834': 'valky.png',
  '652651010011037737': 'wyatt.png',
  '1099105898783318016': 'mannfischer.png',
  '968672206198554685': 'jace.png',
  '1135887327818944524': 'yuri.png',
};

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // Set custom presence/status
  client.user.setPresence({
    status: 'online', // Options: 'online' | 'idle' | 'dnd' | 'invisible'
    activities: [{
      name: 'Users in JCR for indexing',
      type: 3 // 0 = Playing, 1 = Streaming, 2 = Listening, 3 = Watching, 5 = Competing
    }]
  });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // === !profilecard @user ===
  if (command === '!profilecard') {
    const mentioned = message.mentions.users.first();
    if (!mentioned) {
      return message.reply("Bruh it has to be the person you want to see the card gang!");
    }

    const file = userCards[mentioned.id];
    if (!file) {
      return message.reply("The card for the user you mentioned wasn’t created yet or found. Please let one of the founders or admins know to get your card created if this about your card! One last thing if a user isn’t in the server or is banned the card will not be retrieved.");
    }

    const imagePath = path.join(__dirname, 'images', file);
    const imageDir = path.join(__dirname, 'images');

    console.log("🧠 Mapped file:", file);
    console.log("🔍 Looking for image at:", imagePath);

    try {
      const files = fs.readdirSync(imageDir);
      console.log("📁 Images folder contains:", files);
    } catch (err) {
      console.error("❌ Couldn’t read images folder:", err);
      return message.reply("Error reading the images folder.");
    }

    if (!fs.existsSync(imagePath)) {
      return message.reply("Card file missing.");
    }

    return message.channel.send({
      content: `Aight gang here is the profile card for <@${mentioned.id}>`,
      files: [imagePath]
    });
  }

  // === !setbackground ===
  if (command === '!setbackground') {
    const attachment = message.attachments.first();
    console.log(`📥 Background request from ${message.author.tag} (${message.author.id})`);

    if (attachment) {
      console.log(`🖼️ Attachment URL: ${attachment.url}`);
    } else {
      console.log(`ℹ️ No image attached with request.`);
    }

    return message.reply("✅ Background change request received. Admins will review your image soon.");
  }

  // === !pcabout ===
  if (command === '!pcabout') {
    return message.channel.send({
      content: "Hello here is everything you need to know about the profile cards",
      embeds: [
        {
          title: "Basic stuff",
          description: "Use !profilecard [@User] it will pull up their card once it was created\n\nAdditionally using !setbackground and sending an image will send a request to the bots terminal and the admins or founders will review your image and if approved your desired image will be the background of your profile card.\n\n__**NO GIFS**__",
          color: 2326507
        },
        {
          title: "Basic stuff",
          description: "Use !profilecard [@User] it will pull up their card once it was created\n\nAdditionally using !setbackground and sending an image will send a request to the bots terminal and the admins or founders will review your image and if approved your desired image will be the background of your profile card.\n\n__**NO GIFS**__",
          color: 2326507
        },
        {
          title: "AI",
          description: "So here is how my AI works so you can get a better understanding of it",
          color: 2326507,
          fields: [
            {
              name: "Indexing",
              value: "The bot usually indexes everyday at all channels automatically for user data. Based on __**collected and trained data**__ it will output that into your profile card automatically. This includes summaries too. __**If any errors are found it will be manually updated by a founder**__"
            },
            {
              name: "Public data",
              value: "If there is any public data of the user found on google or on their discord profile, it will output all their connections."
            },
            {
              name: "Privacy",
              value: "If a user has left the server their data will be deleted until they have returned. Their data won’t be updated when they’re gone either. __***THIS INCLUDES BANNED USERS***__"
            },
            {
              name: "Miscellaneous",
              value: "Any help needed for the bot contact the founders, also use !sum [@user] to regenerate their community feedback. It’s not guaranteed to change"
            }
          ]
        }
      ]
    });
  }
});

client.login(TOKEN);
