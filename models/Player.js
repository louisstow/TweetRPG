var mongoose = require("../config/db");

var playerSchema = new mongoose.Schema({
	//unique twitter handle
	handle: String,

	//simple stats
	health: Number,
	level: Number,

	//metadata
	joined: Date,

	//inventory
	weapon: {
		name: String,
		value: Number
	},

	shield: {
		name: String,
		value: Number
	},

	armour: {
		name: String,
		value: Number
	},

	helmet: {
		name: String,
		value: Number
	},

	boots: {
		name: String,
		value: Number
	}
});

var Player = mongoose.model("Player", playerSchema);

module.exports = Player;