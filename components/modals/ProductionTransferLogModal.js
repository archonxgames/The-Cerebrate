const { ActionRowBuilder, ModalBuilder, TextInputBuilder } = require('@discordjs/builders')
const { TextInputStyle } = require('discord.js')

const modal = new ModalBuilder()
	.setCustomId('newProductionTransferLog')
	.setTitle('New Production Log')

// Add components to modal

// Create the text input components
const sourceInput = new TextInputBuilder()
	.setCustomId('source')
	.setLabel('Source Stockpile')
	.setPlaceholder('SO-ST-001')
	.setRequired(true)
	.setStyle(TextInputStyle.Short)
const targetInput = new TextInputBuilder()
	.setCustomId('target')
	.setLabel('Target Stockpile')
	.setPlaceholder('SO-ST-002')
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
	new ActionRowBuilder().addComponents(sourceInput),
	new ActionRowBuilder().addComponents(targetInput),
	new ActionRowBuilder().addComponents(itemTypeInput),
	new ActionRowBuilder().addComponents(amountInput),
	new ActionRowBuilder().addComponents(unitInput)
)

async function execute(interaction) {
	const user_ = `<@${interaction.user.id}>`;
	const source = interaction.fields.getTextInputValue('source');
	const target = interaction.fields.getTextInputValue('target');
	const item_ = interaction.fields.getTextInputValue('item');
	const amount_ = interaction.fields.getTextInputValue('amount');
	const unit_ = interaction.fields.getTextInputValue('unit');
	console.log({ user_, source, target, item_, amount_, unit_ });
	
	await interaction.reply({ content: 'Your submission was received successfully. Thank you for your service!', ephemeral: true });
	await interaction.channel.send({ content: `${user_} has transferred **${amount_} ${unit_.toLowerCase() + ((amount_ > 1) ? 's' : '')}** of **${item_}** from **${source}** to **${target}**.` });
}

module.exports = {
	modal: modal,
	execute
}