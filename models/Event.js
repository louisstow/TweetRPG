var util = require("util");
var Item = require("./Item");
var Battle = require("./Battle");

var slots = Battle.SLOTS;

//structure of all the event stories
//ensure all these stories are < 120 characters
var Stories = {
	encounter: [
		"A thief in the night awakes you. You spring to action.",
		"Drunkly you accuse a man of trickery. He challenges you.",
		"You overhear someone besmirch your family name. Time to teach them a lesson.",
		"The darn kids are back to snatch another item. Not this time.",
		"A wild snow golem stops you in your tracks.",
		"Hiking through the forest a giant spider lands on your shoulder.",
		"Rabid dogs chase you down a hill."
	],

	found: [
		"Whilst trudging through the marshland you find",
		"You see a strange figure in the woods. It notices you and fades into the mist before dropping",
		"Something catches your attention in the dirt. You uncover",
		"Congratulations! You win second place in a beauty contest. Collect",
		"A prince from Nigerania leaves you an inheritance of",
		"After slaying the mad king, the townsfolk repay you with",
		"Amongst the wreckage of a century old ship you discover",
		"You vanquish the evil witch of the west and absorb her"
	],

	lost: [
		"You awake to find a thief has stolen",
		"You trip and drop",
		"Darn kids catch you by suprise and snatch",
		"You lost a game of liars dice and must hand over",
		"A giant will spare your life for",
		"To cross the bridge the troll requires",
		"A giant fiery fox orbiting the earth eats"
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
		var winSynonym  = ["Champion!", "You won", "You survived this time", "Too easy", "Tore through em like boiled ham"];
		var loseSynonym = ["You lost", "Death", "Try again", "Find a better weapon next time", "You were overpowered"];

		var syn = battle.winner === player.handle ? winSynonym : loseSynonym;
		var tweet = syn[syn.length * Math.random() | 0];

		//show XP increase or decrease after battle
		var stat;
		if (battle.winner === player.handle) {
			stat = util.format(" [+%dXP", battle.xpInc);
			if (battle.levelInc)
				stat += util.format(" +%dLVL", battle.levelInc);
			stat += "]";
		} else {
			stat = util.format(" [-%dXP]", battle.xpDec);
		}

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
	var roll = Math.random() * 5 | 0;
	var turn = "encounter";

	if (roll >= 3) {
		turn = "found"
	} else if (roll == 2) {
		turn = "lost"
	}

	var story = Stories[turn][Math.random() * Stories[turn].length | 0];

	var tweet = [
		"@" + player.handle,
		story,
		Turns[turn](player)
	].join(" ");

	console.log(turn, tweet, tweet.length);
	player.lastAction = tweet;
	player.save();

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

	//generate the stats for the loser
	var loserStats = util.format("[-%dXP]", battle.xpDec);
	
	var tweet = [
		"@" + battle.winner,
		stats,
		beatSynonyms[beatSynonyms.length * Math.random() | 0],
		"@" + battle.loser,
		loserStats,
		"and",
		stealSynonyms[stealSynonyms.length * Math.random() | 0] + ":",
		battle.prize.item.name || "nothing"
	];

	if (battle.prize.value)
		tweet.push("(" + battle.prize.value + ")");

	tweet = tweet.join(" ")

	player.lastAction = tweet;
	enemy.lastAction = tweet;
	player.save();
	enemy.save();

	return tweet;
}
