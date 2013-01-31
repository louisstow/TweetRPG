var Player = require("../models/Player");
var Battle = require("../models/Battle");

Player.findOrCreate("louisstow", function() {
	console.log("FIND OR CREATE", arguments);
});

Battle.fight({
	level: 2,
	weapon: 3,
	shield: 3,
	boots: 2,
	armour: 1,
	helmet: 4
}, {
	level: 1,
	weapon: 4,
	shield: 2,
	boots: 8,
	armour: 1,
	helmet: 2
});