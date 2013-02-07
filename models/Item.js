/**
* name - Unique name of the item
* value - Numerical scale from 1 - 10 of power. It inversely affects rarity
* stat - Slot in the inventory to be placed (weapon, shield, armour, helmet, boots)
*/

exports.items = {
	1: [ //default items for new players
		{name: "Wooden Sword", value: 1, stat: "weapon"},
		{name: "Wooden Shield", value: 1, stat: "shield"},
		{name: "Tunic", value: 1, stat: "armour"},
		{name: "Rag Hat", value: 1, stat: "helmet"},
		{name: "Old Shoes", value: 1, stat: "boots"}
	],

	2: [
		{name: "Steel Dagger", value: 2, stat: "weapon"},
		{name: "Steel Shield", value: 2, stat: "shield"},
		{name: "Leather Armour", value: 2, stat: "armour"},
		{name: "Leather Headgear", value: 2, stat: "helmet"},
		{name: "Steel Boots", value: 2, stat: "boots"}
	],

	3: [
		{name: "Shortsword", value: 3, stat: "weapon"},
		{name: "Chainmail", value: 3, stat: "armour"},
		{name: "Horned Helmet", value: 3, stat: "helmet"},
		{name: "Spiked Boots", value: 3, stat: "boots"}
	],

	4: [
		{name: "Common Bow", value: 4, stat: "weapon"},
		{name: "Mace", value: 4, stat: "weapon"}
	],

	5: [
		{name: "Long Bow", value: 5, stat: "weapon"},
		{name: "Dual Axes", value: 5, stat: "weapon"},
		{name: "Enforced-steel Armour", value: 5, stat: "armour"},
		{name: "Tritanium Helmet", value: 5, stat: "helmet"}
	],

	6: [
		{name: "Crossbow", value: 6, stat: "weapon"},
		{name: "Trident", value: 6, stat: "weapon"},
		{name: "Tritanium Armour", value: 6, stat: "armour"}
	],

	7: [
		{name: "Spear", value: 7, stat: "weapon"},
		{name: "Morning Star", value: 7, stat: "weapon"},
		{name: "Enchanted Protection", value: 7, stat: "armour"}
	],

	8: [
		{name: "War Hammer", value: 8, stat: "weapon"}
	],

	9: [
		{name: "Firesword", value: 9, stat: "weapon"},
		{name: "Stride of Flight", value: 9, stat: "boots"}
	],

	10: [
		{name: "Staff of Norvale", value: 10, stat: "weapon"},
		{name: "Clairvoyant Hood", value: 10, stat: "helmet"},
		{name: "Seventh Deadly Sinsword", value: 10, stat: "weapon"}
	]
};

var weightedList = [];

//generate a weighted array where n appears 11-n times
for (var i = 1; i <= 10; ++i) {
	for (var j = 0; j < 11 - i; ++j)
		weightedList.push(i);
}

//sort the weighted list randomly
weightedList.sort(function () {
	return Math.round(Math.random() * 2 - 1);
});

//generate a random value item to take
//with weighting on the higher values
function randomValue () {
	return weightedList[Math.random() * weightedList.length | 0]
}

//return a random item
exports.pickItem = function () {
	var levelItems = exports.items[randomValue()];
	return levelItems[levelItems.length * Math.random() | 0];
}

exports.randomValue = randomValue;
exports.weightedList = weightedList;