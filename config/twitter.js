var twitter = require("ntwitter");
var auth = require("./auth.js");

module.exports = new twitter(auth);