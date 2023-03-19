const { PermissionFlagsBits } = require('discord.js')
const GuildSetting = require('../../data/models/GuildSetting').data

module.exports = {
	async execute(interaction) {
		//Get the interaction data
		const guildId = interaction.guildId
		let iconId = interaction.options.getString('icon-id')
		
		//Do a permission check
		if (iconId != null && !interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
			return await interaction.reply({ content: 'Sorry, you do not have the required permissions to use this feature. If you think this is a mistake, please contact your server administrator.', ephemeral: true})
		}
		
		//Get/update guild settings
		try {
			//Get guild settings
			settings = await GuildSetting.findOne({
				where: { guildId }
			})
			
			//Create settings if none exists
			if(settings == null) {
				settings = await GuildSetting.create((iconId != null) ? {guildId, iconId} : {guildId})
			} 
			//Update guild settings if icon is not null
			else if (iconId != null) {
				settings.iconId = iconId
				await settings.save()
			}
		} catch (error) {
			console.error('ERROR - icon.js - Error retrieving or updating guild settings\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Return a response
		try {
			return await interaction.reply(
				(iconId != null) 
					? {content: `The regiment icon has now been set to ${iconId}.`}
					: {content: `The regiment icon is currently ${(settings.iconId != null) ? `set to ${settings.iconId}.` : 'not set.'}`}
			)
		} catch (error) {
			console.error('ERROR - commands/regiment/icon.js - Error executing this command.\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}