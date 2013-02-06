var Player = require("../models/Player");
var Battle = require("../models/Battle");

Player.findOrCreate("louisstow", function() {
	console.log("FIND OR CREATE", arguments);
});

console.log(Battle.fight({
	handle: "louisstow",
	level: 15,
	weapon: { value: 3 },
	shield: { value: 3 },
	boots: { value: 2 },
	armour: { value: 1 },
	helmet: { value: 4 },
	xp: 300
}, {
	handle: "paxell",
	level: 5,
	weapon: { value: 4 },
	shield: { value: 2 },
	boots: { value: 8 },
	armour: { value: 1 },
	helmet: { value: 2 },
	xp: 200
}));