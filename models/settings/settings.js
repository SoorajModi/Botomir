/* eslint-disable no-underscore-dangle */

const mongoose = require('mongoose');
const schema = require('./schema');

const SettingModels = mongoose.model('serverSettings', schema);

class Settings {
    constructor() {
        this._model = new SettingModels();
    }

    get _mongoId() {
        return this._model._id;
    }

    get guildID() {
        return this._model.guild;
    }

    get auditChannel() {
        return this._model.audit_channel;
    }

    get musicChannelID() {
        return this._model.music_channel;
    }

    get commandPrefix() {
        return this._model.command_prefix;
    }

    get playlistName() {
        return this._model.playlist_name;
    }

    get playlistDescription() {
        return this._model.playlist_description;
    }

    get tempUnit() {
        return this._model.tempature_unit;
    }

    get weatherLocation() {
        return this._model.weather_location;
    }

    get memeSubs() {
        return this._model.meme_subreddits;
    }

    get cuteSubs() {
        return this._model.cute_subreddits;
    }

    get botAdminRole() {
        return this._model.bot_admin_role;
    }

    get disabledCommands() {
        return this._model.disabled_commands;
    }

    get mentalHealth() {
        return this._model.mental_health.map((l) => ({
            name: l.name, url: l.url,
        }));
    }

    get unassignableRoles() {
        return this._model.unassignable_roles;
    }

    get timezone() {
        return this._model.timezone;
    }

    setGuild(guild) {
        if (typeof guild === 'string') {
            this._model.guild = guild;
        }
        return this;
    }

    setAuditChannel(channel) {
        if (typeof channel === 'string') {
            this._model.audit_channel = channel;
        }
        return this;
    }

    setMusicChannel(channel) {
        if (typeof channel === 'string') {
            this._model.music_channel = channel;
        }
        return this;
    }

    setCommandPrefix(prefix) {
        if (typeof prefix === 'string') {
            this._model.command_prefix = prefix;
        }
        return this;
    }

    setPlaylistName(name) {
        if (typeof name === 'string') {
            this._model.playlist_name = name;
        }
        return this;
    }

    setPlaylistDescription(description) {
        if (typeof description === 'string') {
            this._model.playlist_description = description;
        }
        return this;
    }

    setTempUnit(unit) {
        if (typeof unit === 'string') {
            this._model.tempature_unit = unit;
        }
        return this;
    }

    setWeatherLocation(location) {
        if (typeof location === 'string') {
            this._model.weather_location = location;
        }
        return this;
    }

    setAdminRole(roleName) {
        if (typeof roleName === 'string') {
            this._model.bot_admin_role = roleName;
        }
        return this;
    }

    addMemeSub(sub) {
        if (typeof sub === 'string' && !this._model.meme_subreddits.includes(sub)) {
            this._model.meme_subreddits.push(sub);
        }
        return this;
    }

    removeMemeSub(sub) {
        if (typeof sub === 'string') {
            const index = this._model.meme_subreddits.indexOf(sub);
            if (index > -1) this._model.meme_subreddits.splice(index, 1);
        }
        return this;
    }

    addCuteSub(sub) {
        if (typeof sub === 'string' && !this._model.cute_subreddits.includes(sub)) {
            this._model.cute_subreddits.push(sub);
        }
        return this;
    }

    removeCuteSub(sub) {
        if (typeof sub === 'string') {
            const index = this._model.cute_subreddits.indexOf(sub);
            if (index > -1) this._model.cute_subreddits.splice(index, 1);
        }
        return this;
    }

    addUnassignable(roleName) {
        if (typeof roleName === 'string' && !this._model.unassignable_roles.includes(roleName)) {
            this._model.unassignable_roles.push(roleName);
        }
        return this;
    }

    removeUnassignable(roleName) {
        if (typeof roleName === 'string') {
            const index = this._model.unassignable_roles.indexOf(roleName);
            if (index > -1) this._model.unassignable_roles.splice(index, 1);
        }
        return this;
    }

    disableCommand(command) {
        if (typeof command === 'string' && !this._model.disabled_commands.includes(command)) {
            this._model.disabled_commands.push(command);
        }
        return this;
    }

    enableCommand(command) {
        if (typeof command === 'string') {
            const index = this._model.disabled_commands.indexOf(command);

            if (index > -1) this._model.disabled_commands.splice(index, 1);
        }
        return this;
    }

    setMentalHealthLinks(links) {
        if (Array.isArray(links)) {
            this._model.mental_health = links;
        }
        return this;
    }

    setTimezone(zone) {
        if (typeof zone === 'string') {
            this._model.timezone = zone;
        }
        return this;
    }

    save() {
        return this._model.save().then(() => this);
    }

    toAPI() {
        return {
            guild: this._model.guild,
            musicWatchChannel: this._model.music_channel,
            auditChannel: this._model.audit_channel,
            commandPrefix: this._model.command_prefix,
            playlistName: this._model.playlist_name,
            playlistDescription: this._model.playlist_description,
            tempatureUnit: this._model.tempature_unit,
            weatherLocation: this._model.weather_location,
            memeSubs: this._model.meme_subreddits,
            cuteSubs: this._model.cute_subreddits,
            botAdminRole: this._model.bot_admin_role,
            disabledCommands: this._model.disabled_commands,
            mentalHealth: this._model.mental_health.map((m) => ({
                name: m.name, url: m.url,
            })),
            unassignableRoles: this._model.unassignable_roles,
        };
    }

    static getServerSettings(serverID) {
        return SettingModels.findOne({
            guild: serverID,
        })
            .then((res) => {
                if (res === null) return new Settings().setGuild(serverID).save();
                const s = new Settings();
                s._model = res;
                return s;
            });
    }

    static getAll() {
        return SettingModels.find({
        })
            .then((res) => res.map((r) => {
                const s = new Settings();
                s._model = r;
                return s;
            }));
    }
}

module.exports = {
    Settings,
};
