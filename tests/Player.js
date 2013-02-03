var Player = require("../models/Player");
var Battle = require("../models/Battle");

Player.findOrCreate("louisstow", function() {
	console.log("FIND OR CREATE", arguments);
});

console.log(Battle.fight({
	handle: "louisstow",
	level: 15,
	weapon: 3,
	shield: 3,
	boots: 2,
	armour: 1,
	helmet: 4,
	xp: 300,
	health: 10
}, {
	handle: "paxell",
	level: 5,
	weapon: 4,
	shield: 2,
	boots: 8,
	armour: 1,
	helmet: 2,
	xp: 200,
	health: 10
}));