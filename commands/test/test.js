const { SlashCommandBuilder } = require('discord.js');

function test(channel, count) {
	setInterval(() => {
		channel.send({content: `Test has been executed recursively ${count} times.`})
		++count
	}, 2000)
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Test command for running timer-based updates.'),
	async execute(interaction) {
		test(interaction.channel, 1)
		await interaction.reply('Pong!');
	},
};