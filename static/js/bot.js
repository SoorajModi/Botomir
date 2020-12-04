const Discord = require("discord.js");
const mongoose = require("mongoose");

const {commandHandler} = require("./botCommands");
const {messageScanner} = require("./botMessage");
const {reactionHandler} = require("./botReactions");

export const client = new Discord.Client();

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true}).then(r => console.log("Successfully connected to MongoDB - " + r));

const MessagePost = mongoose.model("messages", {
    guild: String,
    channel: String,
    author: String,
    content: String,
    timestamp: Date,
    id: String
});

client.once("ready", () => {
    // Notify connection ready
    console.log("Bot is connected to Discord!");

    // Notify guild connected to + num members
    client.guilds.fetch(process.env.DISCORD_GUILD_ID)
        .then(guild =>
            console.log("Connected to server: " + guild.name + ", id: " + guild.id +
                "\nMember Count: " + guild.memberCount))
        .catch(console.error);

    // Cache message for reactions
    client.channels.cache.get(process.env.DISCORD_CHANNEL_ID).messages.fetch(process.env.DISCORD_MESSAGE_ID)
        .then(message => console.log("Cached message found: " + message))
        .catch(e => console.log("Error: cached message not found | " + e));

    console.log("Bot now ready!");
});

client.on('message', async message => {
    // If the message is from self then ignore
    if (message.author.bot) return;

    // Log the message
    console.log(message.content);

    // Check if message contains keywords
    messageScanner(message);

    // Check if message contains command and handle appropriately
    commandHandler(message);

    // Store messages in database
    storeMessageInDB(message);
});

client.on('messageReactionAdd', (reaction, user) => {
    // Handle reactions to cached messages
    reactionHandler(reaction, user);
});

client.on("error", err => {
    console.log("Error: bot encountered error | " + err);
    client.login(process.env.DISCORD_TOKEN).then(r => console.log("Client successfully rebooted - " + r));
});

function storeMessageInDB(message) {
    const messagePost = new MessagePost({
        guild: message.guild,
        channel: message.channel,
        author: message.author,
        content: message.content,
        timestamp: message.createdAt,
        id: message.id
    });

    messagePost.save().then(r => console.log("Successfully written message to data base - " + r));
}