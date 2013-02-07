var util = require("util");
var Item = require("./Item");
var Battle = require("./Battle");

var slots = Battle.SLOTS;

//structure of all the event stories
//ensure all these stories are < 120 characters
var Stories = {
	encounter: [
		"A thief in the night awakes you. You spring to action.",
		"Drunkly you accuse a man of"
	],

	found: [
		"Whilst trudging through the marshland you find",
		"You see a strange figure in the woods. It notices you and fades into the mist before dropping",

	],

	lost: [
		"You awake to find a thief has stolen"
	]
};

/**
* methods for the different types of events
* @expects player - Player mongoose model instance
* @returns String - Tweet to send back to player.handle
*/
var Turns = {
	/**
	* "A thief in the night awakes you. You spring to action. "
	*/
	encounter: function (player) {
		var battle = Battle.randomFight(player, player.level);
		console.log(battle);

		//list of synonyms to spice up the response
		var winSynonym  = ["Champion!", "You won", "You survived this time", "Too easy", "Tore through 'em like boiled ham"];
		var loseSynonym = ["You lost", "Death", "Try again", "Find a better weapon next time", "You were overpowered"];

		var syn = battle.winner === player.handle ? winSynonym : loseSynonym;
		var tweet = syn[syn.length * Math.random() | 0];

		//stat informat at the end
		var stat = " [" + util.format("+%dXP", battle.xpInc);
		if (battle.levelInc)
			stat += util.format(" +%dLVL", battle.levelInc);
		stat += "]";

		//only add the stats if we were the winner
		if (battle.winner === player.handle)
			tweet += stat;

		return tweet;
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

		return util.format(
			"%s. Not as good as my %s (%d)",
			found.name,
			current.name,
			current.value
		);
	},

	lost: function (player) {
		var slot = slots[slots.length * Math.random() | 0];

		//clear the slot
		var old = player[slot].name;

		player[slot].value = 0;
		player[slot].name = "";
		player.save();

		return old ? "your " + old : "nothing";
	}
}

exports.roll = function (player) {
	//pick a random turn
	var types = Object.keys(Turns);
	var turn = types[Math.random() * types.length | 0];
	var story = Stories[turn][Math.random() * Stories[turn].length | 0];

	var tweet = [
		"@" + player.handle,
		story,
		Turns[turn](player)
	].join(" ");

	console.log(turn, tweet, tweet.length);
	return tweet;
}

/**
* @result "@louisstow [+8XP +2LVL] defeated @paxell and stole Wooden Sword (1)"
*/
exports.attack = function (player, enemy) {
	var battle = Battle.fight(player, enemy);
	console.log(battle)

	//some synonyms to dramatize the result
	var beatSynonyms = ["defeated", "slayed", "destroyed", "killed", "murdered", "beat"];
	var stealSynonyms = ["stole", "pinched", "got away with", "won", "looted", "gained"];

	//generate the stats for the winner
	var stats = "[" + util.format("+%dXP", battle.xpInc);
	if (battle.levelInc)
		stats += " " + util.format("+%dLVL", battle.levelInc);
	stats += "]";
	
	var tweet = [
		"@" + battle.winner,
		stats,
		beatSynonyms[beatSynonyms.length * Math.random() | 0],
		"@" + battle.loser,
		"and",
		stealSynonyms[stealSynonyms.length * Math.random() | 0] + ":",
		battle.prize.item.name || "nothing"
	];

	if (battle.prize.value)
		tweet.push("(" + battle.prize.value + ")");

	return tweet.join(" ");
}