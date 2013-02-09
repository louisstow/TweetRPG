var Item = require("./Item");

/**
* Helper random functions
*/
function randRange (min, max) {
	return Math.random() * (max - min) + min;
}

function randIntRange (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.SLOTS = [ "weapon", "shield", "armour", "helmet", "boots" ];

exports.randomEnemy = function (level) {
	var enemy = {
		handle: "enemy",
		level:  randIntRange(level - 1, level + 1),
		weapon: { value: Item.randomValue() - 1 },
		armour: { value: Item.randomValue() - 1 },
		shield: { value: Item.randomValue() - 1 },
		helmet: { value: Item.randomValue() - 1 },
		boots:  { value: Item.randomValue() - 1 }
	};

	enemy.xp = Math.pow(enemy.level, 3);
	return enemy;
};

exports.randomFight = function (p, level) {
	var enemy = exports.randomEnemy(level);
	console.log(enemy)
	return exports.fight(p, enemy, false);
}

exports.fight = function (p, e, steal) {
	//create a summary structure
	var summary = {};

	//default steal to `true`
	steal = arguments.length < 3 ? true : steal;

	//add a randomization weight to the overall score
	var playerScore = randRange(0.6, 1) * p.level * (p.weapon.value + p.armour.value + p.shield.value + p.helmet.value + p.boots.value);
	var enemyScore  = randRange(0.6, 1) * e.level * (e.weapon.value + e.armour.value + e.shield.value + e.helmet.value + e.boots.value);

	//a negative number means the enemy wins,
	//positive means player wins
	var result = (playerScore - enemyScore);
	var winner, loser;
	summary.result = result;
	summary.playerScore = playerScore;
	summary.enemyScore = enemyScore;

	if (result < 0) {
		//enemy wins
		winner = e;
		loser  = p;
		summary.winner = e.handle;
		summary.loser  = p.handle;
	} else {
		//player wins
		winner = p;
		loser  = e;
		summary.winner = p.handle;
		summary.loser  = e.handle;
	}

	//update all the player properties
	var newXP = Math.pow(loser.level, 3);
	summary.xpDec = loser.xp - newXP;
	loser.xp = newXP;
	
	//increase the xp and see if player gained a level
	var xpInc = Math.pow(Math.max((loser.level - winner.level) + 1, 2), 3);
	var newLevel = Math.pow(xpInc + winner.xp, 1 / 3) | 0;
	if (newLevel > winner.level) {
		summary.levelInc = newLevel - winner.level;
		winner.level = newLevel;
	}

	winner.xp += xpInc;
	summary.xpInc = xpInc;

	//steal an item from the loser
	if (steal) {
		var randomSlot = exports.SLOTS[exports.SLOTS.length * Math.random() | 0];
		
		winner[randomSlot] = {
			name:  loser[randomSlot].name,
			value: loser[randomSlot].value
		};
		
		loser[randomSlot] = { name: "", value: 0 };
		summary.prize = { slot: randomSlot, item: winner[randomSlot] };
	}

	//save the data if a mongo model
	if (typeof e.save === "function") e.save();
	if (typeof p.save === "function") p.save();
	
	return summary;
}
