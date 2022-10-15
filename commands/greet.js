const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('greet')
		.setDescription('Replies with a greeting!')
		.addUserOption(option => option.setName('user').setDescription('User to greet').setRequired(false)),
	async execute(interaction) {
		const user = interaction.options.getUser('user') || `<@${interaction.user.id}>`;

		await interaction.reply(`All hail Thea Maro, ${user}! Majulah SAF!`);
	},
};