const { PermissionFlagsBits } = require('discord.js')
const GuildSetting = require('../../data/models/GuildSetting').data

module.exports = {
	async execute(interaction) {
		//Get the interaction data
		const guildId = interaction.guildId
		let name = interaction.options.getString('name')
		
		//Do a permission check
		if (name != null && !interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
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
				settings = await GuildSetting.create((name != null) ? {guildId, name} : {guildId})
			} 
			//Update guild settings if name is not null
			else if (name != null) {
				settings.name = name
				await settings.save()
			}
		} catch (error) {
			console.error('ERROR - name.js - Error retrieving or updating guild settings\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Return a response
		try {
			return await interaction.reply(
				(name != null) 
					? {content: `The regiment name has now been set to **${name}**.`}
					: {content: `The regiment name is currently ${(settings.name != null) ? `set to **${settings.name}**.` : 'not set.'}`}
			)
		} catch (error) {
			console.error('ERROR - commands/regiment/name.js - Error sending response.\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}