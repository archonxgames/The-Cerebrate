const { mysqlDB, mysqlHost, mysqlPort, mysqlUser, mysqlPass } = require('../../config.json');
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(`mysql://${mysqlUser}:${mysqlPass}@${mysqlHost}:${mysqlPort}/${mysqlDB}`)

const model = sequelize.define('ProductionSetting', {
	guildId: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true
	},
	greetMessage: {
		type: DataTypes.STRING,
		allowNull: true
	},
	stockpileSheetTemplateId: {
		type: DataTypes.STRING,
		allowNull: true
	}
})

module.exports = {
	data: model
}