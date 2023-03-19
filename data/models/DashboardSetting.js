const { mysqlDB, mysqlHost, mysqlPort, mysqlUser, mysqlPass } = require('../../config.json');
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(`mysql://${mysqlUser}:${mysqlPass}@${mysqlHost}:${mysqlPort}/${mysqlDB}`)

const model = sequelize.define('DashboardSetting', {
	guildId: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true
	},
	logChannelId: {
		type: DataTypes.STRING,
		allowNull: true
	},
	dashboardChannelId: {
		type: DataTypes.STRING,
		allowNull: true
	},
	dashboardMessageId: {
		type: DataTypes.STRING,
		allowNull: true
	},
	webhookId: {
		type: DataTypes.STRING,
		allowNull: true
	},
	webhookToken: {
		type: DataTypes.STRING,
		allowNull: true
	}
})

module.exports = {
	data: model
}