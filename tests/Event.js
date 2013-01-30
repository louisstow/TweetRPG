var Event = require("../models/Event");
var Player = require("../models/Player");

Player.findOrCreate("louisstow", function(err, player) {
	console.log("ROLL", Event.roll(player));
});