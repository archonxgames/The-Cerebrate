const { ActionRowBuilder, ModalBuilder, TextInputBuilder } = require('discord.js')
const { TextInputStyle } = require('discord.js')
const gapi = require('../../utils/GoogleAPIUtils')
const foxhole = require('../../utils/FoxholeAPIUtils')
const dt = require('../../utils/DateTime')
const ProductionSetting = require('../../data/models/ProductionSetting').data
const StockpileSheet = require('../../data/models/StockpileSheet').data

const modal = new ModalBuilder()
	.setCustomId('newProductionSubmitLog')
	.setTitle('New Production Log')

// Add components to modal
const stockpileInput = new TextInputBuilder()
	.setCustomId('stockpile')
	.setLabel('Stockpile')
	.setPlaceholder('SO-ST-001')
	.setRequired(true)
	.setStyle(TextInputStyle.Short)
const itemTypeInput = new TextInputBuilder()
	.setCustomId('item')
	.setLabel('Type of Item')
	.setPlaceholder('Bmats')
	.setRequired(true)
	.setStyle(TextInputStyle.Short)
const amountInput = new TextInputBuilder()
	.setCustomId('amount')
	.setLabel('Amount')
	.setPlaceholder('1')
	.setRequired(true)
	.setStyle(TextInputStyle.Short)
const unitInput = new TextInputBuilder()
	.setCustomId('unit')
	.setLabel('Unit')
	.setPlaceholder('Single, Crate')
	.setRequired(true)
	.setStyle(TextInputStyle.Short)

// Add inputs to the modal
modal.addComponents(
	new ActionRowBuilder().addComponents(stockpileInput),
	new ActionRowBuilder().addComponents(itemTypeInput),
	new ActionRowBuilder().addComponents(amountInput),
	new ActionRowBuilder().addComponents(unitInput)
)

async function execute(interaction) {
	//Defer the reply
	await interaction.deferReply({ ephemeral: true })

	//Get the interaction data
	const guildId = interaction.guildId
	const user = interaction.user
	const stockpile = interaction.fields.getTextInputValue('stockpile')
	const item = interaction.fields.getTextInputValue('item')
	const amount = interaction.fields.getTextInputValue('amount')
	const unit = interaction.fields.getTextInputValue('unit')
	console.log({ user, stockpile, item, amount, unit })

	//Obtain current war data
	let war = null
	try {
		warData = await foxhole.getWarData()
		war = warData.warNumber
	} catch (error) {
		console.error('ERROR - ProductionSubmitLogModal.js - Error obtaining current war data:\n', error)
		return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
	}

	//Append production log to gsheet
	let result = null
	try {
		result = await StockpileSheet.findOne({
			where: { guildId, war }
		})

		if (result != null) {
			let sheetId = result.sheetId
	
			const range = `'Production Log'`
			const values = [[dt.format(new Date()),user.username, stockpile, item, amount, unit]]
			
			gapi.sheets.appendValues(sheetId, range, 'USER_ENTERED', values)
		}
	} catch (error) {
		console.error('ERROR - ProductionSubmitLogModal.js - Error updating google sheet\n', error)
		return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
	}

	//Attempt to send message in the production log channel
	try {
		let settings = await ProductionSetting.findOne({
			where: { guildId }
		})

		//Create settings if none exists
		if(settings == null) {
			settings = await ProductionSetting.create({guildId})
		} else {
			let channel = (settings.logChannelId != null) ? 
				await interaction.guild.channels.fetch(settings.logChannelId) :
				interaction.channel
			await channel.send({ content: `<@${user.id}> has submitted **${amount} ${unit.toLowerCase() + ((amount > 1) ? 's' : '')}** of **${item}** to **${stockpile}**.` })
		}
		if (result == null) {
			return await interaction.editReply({content: 'Your submission was received successfully. Thank you for your service!\nNo stockpile sheet exists to save the production log to. To create a stockpile sheet, enter the `/stockpile init` command.', ephemeral: true})
		}
		return await interaction.editReply({ content: 'Your submission was received successfully. Thank you for your service!', ephemeral: true })
	} catch (error) {
		console.error('ERROR - ProductionSubmitLogModal.js - Error sending reply to production log channel\n', error)
		return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
	}
}

module.exports = {
	modal: modal,
	execute
}