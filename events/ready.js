module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`INFO - ${client.user.tag} is now online.`);
	}
};