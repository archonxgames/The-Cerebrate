const { ActionRowBuilder, ModalBuilder, TextInputBuilder } = require('@discordjs/builders')
const { TextInputStyle } = require('discord.js')

const modal = new ModalBuilder()
	.setCustomId('newProductionSubmitLog')
	.setTitle('New Production Log')

// Add components to modal

// Create the text input components
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

module.exports = {
	modal: modal
}