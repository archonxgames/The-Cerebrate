const DumbledoreScanner = require('../messages/DumbledoreScanner')

module.exports = {
	type: 'messageCreate',
	async execute(message) {
		// console.log(message)

		//Dumbledore Scanner
		await DumbledoreScanner.execute(message)
	}
}