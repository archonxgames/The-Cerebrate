const { mysqlDB, mysqlHost, mysqlPort, mysqlUser, mysqlPass } = require('../config.json');
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(`mysql://${mysqlUser}:${mysqlPass}@${mysqlHost}:${mysqlPort}/${mysqlDB}`)

const model = sequelize.define('StockpileSheet', {
	guildId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	war: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	sheetUrl: {
		type: DataTypes.STRING,
		allowNull: false
	}
})

module.exports = {
	data: model
}