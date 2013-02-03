var ff = require("ff");

var mongoose = require("../config/db");
var Item = require("./Item");

var playerSchema = new mongoose.Schema({
	//unique twitter handle
	handle: String,

	//simple stats
	health: { type: Number, default: 10 },
	level: { type: Number, default: 1 },
	xp: { type: Number, default: 1 },

	//metadata
	joined: { type: Date, default: Date.now },

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
	var self = this;

	ff(function () {
		self.find({handle: handle}, this.slot());
	}, function (player) {
		//nothing found, create a new player
		if (!player.length) {
			var starterItems = Item.items[1];
			self.create({
				handle: handle,
				weapon: starterItems[0],
				shield: starterItems[1],
				armour: starterItems[2],
				helmet: starterItems[3],
				boots:  starterItems[4]
			}, this.slot());
		} else
			this.pass(player[0]);
	}).cb(next);
}

module.exports = mongoose.model("Player", playerSchema);