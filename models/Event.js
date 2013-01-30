var Item = require("./Item");

var slots = [ "weapon", "shield", "armour", "helmet", "boots" ]

//structure of all the event stories
//ensure all these stories are < 140 characters
var Stories = {
	encounter: [
		"A thief in the night awakes you. You spring to action.",
		
	],

	found: [
		"Whilst trudging through the marshland you find",
		"You see a strange figure in the woods. It notices you and fades into the mist before dropping",

	],

	lost: [
		"You awake to find a thief has stolen your"
	]
};

/**
* methods for the different types of events
* @expects player - Player mongoose model instance
* @returns String - 
*/
var Turns = {
	encounter: function () {

	},

	found: function (player) {
		var found = Item.pickItem();
		var current = player[found.stat];

		//if the value is better, keep it
		if (found.value > current.value) {
			player[found.stat].name = found.name;
			player[found.stat].value = found.value;
			player.save();

			return found.name + " (" + found.value + ")";
		}

		return " " + found.name + ". Not as good as my " + current.name;
	},

	lost: function (player) {
		var slot = slots[slots.length * Math.random() | 0];

		//clear the slot
		var old = player[slot].name;

		player[slot].value = 0;
		player[slot].name = "";
		player.save();

		return " " + old;
	}
}

exports.roll = function (player) {
	//pick a random turn
	var types = Object.keys(Turns);
	var turn = types[Math.random() * types.length | 0];
	var story = Stories[turn][Math.random() * Stories[turn].length | 0];

	var tweet = story + Turns[turn](player);

	console.log(turn, tweet);
}

exports.attack = function () {

}