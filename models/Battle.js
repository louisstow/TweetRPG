
function randRange (min, max) {
	return Math.random() * (max - min) + min;
}

exports.randomEnemy = function (level) {
	var enemy = {
		handle: "enemy",
		level:  randRange(level - 1, level + 1),
		weapon: { value: randRange(1, 10) },
		armour: { value: randRange(1, 10) },
		shield: { value: randRange(1, 10) },
		helmet: { value: randRange(1, 10) },
		boots:  { value: randRange(1, 10) },
		health: 10
	};

	enemy.xp = Math.pow(enemy.level, 3);
	return enemy;
};

/**
* Multiply their level with all stats 
* and divide the attack / defence as the damage
* to HP.
*/
exports.fight = function(p, e) {
	//players chance of dodging
	var playerDodge = Math.max(2, e.weapon.value - p.boots.value) * Math.random();
	var enemyDodge  = Math.max(2, p.weapon.value - e.boots.value) * Math.random();

	//create a summary structure
	var summary = {};
	summary[p.handle] = {};
	summary[e.handle] = {};

	//damage to the opponent
	var playerDamage = Math.ceil((p.level * p.weapon.value * 3) / (e.level * (e.armour.value + e.shield.value + e.helmet.value)));
	var enemyDamage  = Math.ceil((e.level * e.weapon.value * 3) / (p.level * (p.armour.value + p.shield.value + p.helmet.value)));

	var playerXP = Math.pow(Math.max((e.level - p.level) + 1, 2), 3);
	var enemyXP  = Math.pow(Math.max((p.level - e.level) + 1, 2), 3);
	summary[p.handle].xpInc = playerXP;
	summary[e.handle].xpInc = enemyXP;

	//if the player missed
	if (playerDodge < 1) {
		summary[p.handle].dodge = true;
	} else {
		summary[p.handle].damage = playerDamage;
		p.health -= enemyDamage;
	}

	//if the enemy missed
	if (enemyDodge < 1) {
		summary[e.handle].dodge = true;
	} else {
		summary[e.handle].damage = playerDamage;
		e.health -= playerDamage;
	}

	//increment the experience points
	p.xp += playerXP;
	e.xp += enemyXP;
	
	//see if the players raised a level
	var recalcPlayerLevel = ~~Math.pow(p.xp, 1 / 3);
	if (recalcPlayerLevel > p.level) {
		summary[p.handle].levelInc = recalcPlayerLevel - p.level;
		p.level = recalcPlayerLevel;
		summary[p.handle].level = p.level;
	}

	var recalcEnemyLevel = ~~Math.pow(e.xp, 1 / 3);
	if (recalcEnemyLevel > e.level) {
		summary[e.handle].levelInc = recalcEnemyLevel - e.level;
		e.level = recalcEnemyLevel;
		summary[e.handle].level = e.level;
	}

	//if any of them die
	if (e.health < 0) {
		e.health = 10;
		e.xp = Math.pow(e.level, 3);
		summary[e.handle].died = true;
	}

	if (p.health < 0) {
		p.health = 10;
		p.xp = Math.pow(p.level, 3);
		summary[p.handle].died = true;
	}

	//save the data if a mongo model
	if (typeof e.save === "function") e.save();
	if (typeof p.save === "function") p.save();
	return summary;
};
