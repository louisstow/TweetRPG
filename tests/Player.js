var Player = require("../models/Player");

Player.findOrCreate("louisstow", function() {
	console.log("FIND OR CREATE", arguments);
})