const { ActionRowBuilder, ModalBuilder, TextInputBuilder } = require('@discordjs/builders')
const { TextInputStyle } = require('discord.js')

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
	const user = `<@${interaction.user.id}>`;
	const stockpile = interaction.fields.getTextInputValue('stockpile');
	const item = interaction.fields.getTextInputValue('item');
	const amount = interaction.fields.getTextInputValue('amount');
	const unit = interaction.fields.getTextInputValue('unit');
	console.log({ user, stockpile, item, amount, unit });
	
	await interaction.reply({ content: 'Your submission was received successfully. Thank you for your service!', ephemeral: true });
	await interaction.channel.send({ content: `${user} has submitted **${amount} ${unit.toLowerCase() + ((amount > 1) ? 's' : '')}** of **${item}** to **${stockpile}**.` });
}

module.exports = {
	modal: modal,
	execute
}