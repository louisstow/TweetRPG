var util = require("util");
var Item = require("./Item");
var Battle = require("./Battle");

var slots = [ "weapon", "shield", "armour", "helmet", "boots" ];

//structure of all the event stories
//ensure all these stories are < 120 characters
var Stories = {
	encounter: [
		"A thief in the night awakes you. You spring to action.",
		"Drunkly you accuse a man of "
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
* @returns String - Tweet to send back to player.handle
*/
var Turns = {
	
	encounter: function (player) {
		var enemy = Battle.randomEnemy(player.level);
		var battle = Battle.fight(player, enemy);
		console.log(battle);

		var playerResult = battle[player.handle];
		var enemyResult  = battle.enemy;

		var tweet = [
			"@" + player.handle,
			util.format("-%dHP", playerResult.damage),
			util.format("+%dXP", playerResult.xpInc),
			util.format("+%dLVL", playerResult.levelInc)
		];

		return tweet.join(" ");
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

		return found.name + ". Not as good as my " + current.name;
	},

	lost: function (player) {
		var slot = slots[slots.length * Math.random() | 0];

		//clear the slot
		var old = player[slot].name;

		player[slot].value = 0;
		player[slot].name = "";
		player.save();

		return old;
	}
}

exports.roll = function (player) {
	//pick a random turn
	var types = Object.keys(Turns);
	var turn = types[Math.random() * types.length | 0];
	var story = Stories[turn][Math.random() * Stories[turn].length | 0];

	var tweet = story + " " + Turns[turn](player);

	console.log(turn, tweet, tweet.length);
	return tweet;
}

exports.attack = function (player, enemy) {
	var battle = Battle.fight(player, enemy);

	var playerResult = battle[player.handle];
	var enemyResult  = battle[enemy.handle];

	var tweet = [
		"@" + player.handle,
		util.format("-%dHP", playerResult.damage),
		util.format("+%dXP", playerResult.xpInc),
		util.format("+%dLVL", playerResult.levelInc),

		"|",

		"@" + enemy.handle,
		util.format("-%dHP", enemyResult.damage),
		util.format("+%dXP", enemyResult.xpInc),
		util.format("+%dLVL", enemyResult.levelInc)
	];

	return tweet.join(" ");
}