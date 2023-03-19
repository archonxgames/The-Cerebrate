const { mysqlDB, mysqlHost, mysqlPort, mysqlUser, mysqlPass } = require('../../config.json');
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(`mysql://${mysqlUser}:${mysqlPass}@${mysqlHost}:${mysqlPort}/${mysqlDB}`)

const model = sequelize.define('GuildSetting', {
	guildId: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: true
	},
	tag: {
		type: DataTypes.STRING(5),
		allowNull: true
	},
	iconId: {
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