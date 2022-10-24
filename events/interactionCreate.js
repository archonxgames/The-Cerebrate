const SubmitItemModal = require('../components/modals/ProductionSubmitLogModal')
const TransferItemModal = require('../components/modals/ProductionTransferLogModal')

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand() && !interaction.isModalSubmit() && !interaction.isSelectMenu() && !interaction.isButton()) return;

		console.log(interaction);

		if (interaction.isCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.execute(interaction)
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}

		if (interaction.isModalSubmit()) {
			try {
				switch (interaction.customId) {
					case "newProductionSubmitLog":
						const user = `<@${interaction.user.id}>`;
						const stockpile = interaction.fields.getTextInputValue('stockpile');
						const item = interaction.fields.getTextInputValue('item');
						const amount = interaction.fields.getTextInputValue('amount');
						const unit = interaction.fields.getTextInputValue('unit');
						console.log({ user, stockpile, item, amount, unit });
						
						await interaction.reply({ content: 'Your submission was received successfully. Thank you for your service!', ephemeral: true });
						await interaction.channel.send({ content: `${user} has submitted **${amount} ${unit.toLowerCase() + ((amount > 1) ? 's' : '')}** of **${item}** to **${stockpile}**.` });
						break;
					case "newProductionTransferLog":
						const user_ = `<@${interaction.user.id}>`;
						const source = interaction.fields.getTextInputValue('source');
						const target = interaction.fields.getTextInputValue('target');
						const item_ = interaction.fields.getTextInputValue('item');
						const amount_ = interaction.fields.getTextInputValue('amount');
						const unit_ = interaction.fields.getTextInputValue('unit');
						console.log({ user_, source, target, item_, amount_, unit_ });
						
						await interaction.reply({ content: 'Your submission was received successfully. Thank you for your service!', ephemeral: true });
						await interaction.channel.send({ content: `${user_} has transferred **${amount_} ${unit_.toLowerCase() + ((amount_ > 1) ? 's' : '')}** of **${item_}** from **${source}** to **${target}**.` });
						break;
					default:
						return;
				}
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}

		if (interaction.isSelectMenu()) {
			if (interaction.customId === 'production-log-type') {
				switch(interaction.values[0]) {
					case 'submit':
						await interaction.showModal(SubmitItemModal.modal)
						break
					case 'transfer':
						await interaction.showModal(TransferItemModal.modal)
						break
				}
			}
		}
	}
};