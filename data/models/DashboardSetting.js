const { mysqlDB, mysqlHost, mysqlPort, mysqlUser, mysqlPass } = require('../../config.json');
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(`mysql://${mysqlUser}:${mysqlPass}@${mysqlHost}:${mysqlPort}/${mysqlDB}`)

const model = sequelize.define('DashboardSetting', {
	dashboardMessageId: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true
	},
	guildId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	type: {
		type: DataTypes.STRING,
		allowNull: false
	},
	dashboardChannelId: {
		type: DataTypes.STRING,
		allowNull: false
	}
})

module.exports = {
	data: model
}