
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
		"You awake to find a thief has stolen"
	]
};

//methods for the different types of events
var Turns = {
	encounter: function () {

	},

	found: function () {
		
	},

	lost: function () {

	}
}

exports.roll = function () {
	//pick a random turn
	var types = Object.keys(Turns);
	var turn = types[Math.random() * types.length | 0];
	var story = Stories[turn][Math.random() * Stories[turn].length | 0];

	console.log(turn, story);
}

exports.attack = function () {

}