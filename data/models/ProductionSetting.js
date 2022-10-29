const { mysqlDB, mysqlHost, mysqlPort, mysqlUser, mysqlPass } = require('../../config.json');
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(`mysql://${mysqlUser}:${mysqlPass}@${mysqlHost}:${mysqlPort}/${mysqlDB}`)

const model = sequelize.define('ProductionSetting', {
	guildId: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true
	},
	logChannelId: {
		type: DataTypes.STRING(18),
		allowNull: true
	},
	webhookId: {
		type: DataTypes.STRING(18),
		allowNull: true
	},
	webhookToken: {
		type: DataTypes.STRING,
		allowNull: true
	},
	leaderboardMessageId: {
		type: DataTypes.STRING(18),
		allowNull: true
	}
})

module.exports = {
	data: model
}