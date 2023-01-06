const { EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const foxhole = require('../../utils/FoxholeAPIUtils')

module.exports = {
	async execute(interaction) {
		//Do a permission check
		if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
			return await interaction.reply({ content: 'Sorry, you do not have the required permissions to use this feature. If you think this is a mistake, please contact your server administrator.', ephemeral: true})
		}
		
		//Get the interaction data
		const banner = interaction.options.getString('banner')
		
		//Obtain current war data	
		try {
			var warData = await foxhole.getWarData()
			var war = warData.warNumber
		} catch (error) {
			console.error('ERROR - init.js - Error obtaining current war data\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Look for the message if messageId is not null
		try {
			const embed = new EmbedBuilder()
			.setColor(0x718c6a)
			.setTitle(`War ${war} Begins`)
			.setThumbnail('https://media.discordapp.net/attachments/1038661879591084072/1038662080821219348/imgbin-foxhole-logo-wiki-font-colonial-HK97rSvyMK0qSP19KTAsuFZVd-1651679385-removebg-preview.png?width=539&height=374')
			.setImage(banner)
			.setTimestamp()
			await interaction.channel.send({ embeds: [embed] })
			return await interaction.reply({content: 'A new war banner has been created.', ephemeral: true})
		} catch (error) {
			console.error('ERROR - new.js - Error trying to send modal\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}