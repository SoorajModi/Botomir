const source = require('rfr');

const { getAuthURL } = source('bot/spotify/spotifyApi');
const { sendMessage } = source('bot/utils/util');

// will send a message in a DM with a link to authorize the bot
function authenticateSpotify(message) {
    const authUrl = getAuthURL(message.author.id);
    sendMessage(message.author, `Please go to ${authUrl} to give this bot permissions to create a Spotify playlist`);
}

module.exports = {
    args: false,
    name: 'authspotify',
    botAdmin: false,
    description: 'Authenticate the discord bot with your spotify account in a DM',
    usage: '',
    aliases: [],
    execute: authenticateSpotify,
    docs: `#### Authenticate Spotify
- Command: \`!authspotify\`
- Returns: DM is sent to caller with link to authenticate Spotify
- Example usage:
\`\`\`
User
> !authspotify

Botomir
> <sends DM with authentication link>
\`\`\``,
};
