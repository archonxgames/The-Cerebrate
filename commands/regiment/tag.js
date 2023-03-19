const { PermissionFlagsBits } = require('discord.js')
const GuildSetting = require('../../data/models/GuildSetting').data

module.exports = {
	async execute(interaction) {
		//Get the interaction data
		const guildId = interaction.guildId
		let tag = interaction.options.getString('tag')
		
		//Do a permission check
		if (tag != null && !interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
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
				settings = await GuildSetting.create((tag != null) ? {guildId, tag} : {guildId})
			} 
			//Update guild settings if tag is not null
			else if (tag != null) {
				settings.tag = tag
				await settings.save()
			}
		} catch (error) {
			console.error('ERROR - tag.js - Error retrieving or updating guild settings\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Return a response
		try {
			return await interaction.reply(
				(tag != null) 
					? {content: `The regiment tag has now been set to **${tag}**.`}
					: {content: `The regiment tag is currently ${(settings.tag != null) ? `set to **${settings.tag}**.` : 'not set.'}`}
			)
		} catch (error) {
			console.error('ERROR - commands/regiment/tag.js - Error executing this command.\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}