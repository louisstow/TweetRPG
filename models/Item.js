var mongoose = require("../config/db");

var itemSchema = new mongoose.Schema({
	name: String,	//readable name
	stat: String,	//which inventory slot it belongs in
	value: Number,	//value to augment the player stat
	rarity: Number,	//how rare is this item
});

var Item = mongoose.model("Item", itemSchema);

module.exports = Item;