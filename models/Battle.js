
/**
* pd = p.l * p.w - e.l * (e.a + e.s + e.h + e.b)
* ed = e.l * e.w - p.l * (p.a + p.s + p.h + p.b)
*/
exports.fight = function(p, e) {
	//calculate chance of enemy missing
	var playerChance = (p.boots - e.weapon) * Math.random();
	if (playerChance > 1)
		console.log("Enemy missed", playerChance);

	//calculate chance of player missing
	var enemyChance = (e.boots - p.weapon) * Math.random();
	if (enemyChance > 1)
		console.log("Player missed", enemyChance);

	var playerDamage = (p.level * p.weapon * 4) * (1 / (e.level * (e.armour + e.shield + e.helmet)));
	var enemyDamage  = (e.level * e.weapon * 4) * (1 / (p.level * (p.armour + p.shield + p.helmet)));
	console.log("FIGHT", playerDamage, enemyDamage);
	console.log((e.level * e.weapon * 4), (1 / (p.level * (p.armour + p.shield + p.helmet))))
};