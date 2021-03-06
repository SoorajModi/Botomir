const source = require('rfr');

const { sendMessage, getChannel } = source('bot/utils/util');

const {
    generateMessageContent,
    reactToMessage,
    checkRoles,
} = source('bot/utils/reactionMessage');

const { Role } = source('models/role');

const { parseRoleMessage } = source('bot/utils/roleParsing');
const logger = source('bot/utils/logger');

function createRoleWatch(message, args, config) {
    const channelMention = args.shift().trim();
    const parts = parseRoleMessage(args.join(' '));

    const channel = getChannel(message.guild, channelMention);

    if (!channel) {
        return sendMessage(message.channel, `'${channelMention}' is not a channel, can not create a new role reaction message`);
    }

    // check that the roles actually exist
    const mappings = checkRoles(parts.mappings, message.guild, config.unassignableRoles);

    if (mappings.length > 20) {
        return sendMessage(message.channel, 'Ahh!!!! That is too many roles, I can only watch 20 per message, try splitting it up into multiple messages so it is easier for me to keep track of.');
    }

    let watchMessage;
    return sendMessage(channel, generateMessageContent(parts.header, mappings))
        .then((mes) => {
            watchMessage = mes;
            const promises = mappings.map((m) => new Role()
                .setEmoji(m.clean_emoji)
                .setRole(m.role.name)
                .setRoleID(m.role.id)
                .setGuild(watchMessage.guild.id)
                .setChannel(watchMessage.channel.id)
                .setMessage(watchMessage.id)
                .save());
            return Promise.all(promises);
        })
        .then(() => reactToMessage(watchMessage, mappings))
        .catch((e) => {
            sendMessage(message.channel, `Failed to update the reaction roles: ${e.message}`);
            logger.error('something went wrong saving the roles:', e);
        });
}

module.exports = {
    args: 3,
    name: 'create-role-reaction',
    botAdmin: true,
    description: 'create a message that can be use to automatically assign roles based on reactions',
    usage: '<#channel>\n<message>\n---\nemoji : role mapping',
    aliases: [],
    execute: createRoleWatch,
    docs: `#### Set role mappings for reaction assignment
- Command: \`!create-role-reaction #channel\nintro\n---\n<mapping>\`
- Returns: Botomir will autogenerate a role assignment message to the specified channel
- Specifications
  - The role assignment can start with a message and be followed by \`---\` to specify role reactions
  - You can specify role reactions using the following format: \`<emoji> : <name of role>\`
  - To set a custom name for the role you can use the following format: \`<emoji> : <name of role> : <custom name>\`
  - Will filter out any roles that have been marked as unassignable on the server or that dont exist
  - The channel Must be specified
  - use the \`update-role-reaction\` command to edit the message
- Example usage:
\`\`\`
User
!create-role-reaction #general
This is a really cool message about automated role assignment
---
: fire: : role A : a super cool role
: waffle: : role B
\`\`\`

And will auto-generate the following message in #general:
\`\`\`
This is a really cool message about automated role assignment
:fire: a super cool role
:waffle: role B
\`\`\``,
};
