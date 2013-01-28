var ff = require("ff");

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

playerSchema.statics.findOrCreate = function (handle, next) {
	var f = ff(this, function () {
		this.find({handle: handle}, f.slot());
	}, function (player) {
		console.log(player);
	});
}

module.exports = mongoose.model("Player", playerSchema);