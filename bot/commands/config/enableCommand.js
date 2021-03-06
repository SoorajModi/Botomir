const source = require('rfr');

const { sendMessage } = source('bot/utils/util');

function enableCommand(message, args, config) {
    const commandName = args[0].toLowerCase();

    const { commands } = message.client;

    const command = commands.get(commandName)
        || commands.find((c) => c.aliases && c.aliases.includes(commandName));

    if (!command) return sendMessage(message.channel, `The command \`${commandName}\` does not exist.`);

    if (command.alwaysEnabled) return sendMessage(message.channel, `The command \`${commandName}\` cannot be disabled.`);

    return config.enableCommand(command.name)
        .save()
        .then(() => sendMessage(message.channel, 'Settings updated.'))
        .catch((err) => sendMessage(message.channel, `Error Something went wrong: ${err.message}`));
}

module.exports = {
    args: 1,
    name: 'enable',
    botAdmin: true,
    alwaysEnabled: true,
    description: 'enables a command that has previously been disabled on this server',
    usage: '<command>',
    aliases: ['enable-command'],
    execute: enableCommand,
    docs: `#### Enable Command
- Command: \`!enable-command <name of command>\`
- Returns: command is enabled and success or failure message is sent
- Example usage:
\`\`\`
User
> !enable-command reddit

Botomir
> Settings updated.
\`\`\``,
};
