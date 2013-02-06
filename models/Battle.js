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
		weapon: { value: randIntRange(1, 10) },
		armour: { value: randIntRange(1, 10) },
		shield: { value: randIntRange(1, 10) },
		helmet: { value: randIntRange(1, 10) },
		boots:  { value: randIntRange(1, 10) }
	};

	enemy.xp = Math.pow(enemy.level, 3);
	return enemy;
};

exports.fight = function (p, e) { 
	//create a summary structure
	var summary = {};

	//add a randomization weight to the overall score
	var playerScore = randRange(0.6, 1) * p.level * (p.weapon.value + p.armour.value + p.shield.value + p.helmet.value + p.boots.value);
	var enemyScore  = randRange(0.6, 1) * e.level * (e.weapon.value + e.armour.value + e.shield.value + e.helmet.value + e.boots.value);

	//a negative number means the enemy wins,
	//positive means player wins
	var result = (playerScore - enemyScore);
	var winner, loser;
	summary.result = result;

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
	loser.xp = Math.pow(loser.level, 3);
	
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
	var randomSlot = exports.SLOTS[exports.SLOTS.length * Math.random() | 0];
	
	winner[randomSlot] = {
		name:  loser[randomSlot].name,
		value: loser[randomSlot].value
	};
	
	loser[randomSlot] = { name: "", value: 0 };
	summary.prize = { slot: randomSlot, item: winner[randomSlot] };

	//save the data if a mongo model
	if (typeof e.save === "function") e.save();
	if (typeof p.save === "function") p.save();
	
	return summary;
}
