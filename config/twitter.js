var twitter = require("ntwitter");
var auth = require("./auth.js");

var twit = new twitter(auth);

exports.getMentions = function (lastID, next) {
	var opts = {
		count: 200,
		include_entities: false
	};

	if (lastID) opts.since_id = lastID;

	twit.get("/statuses/mentions_timeline.json", opts, next);
}

exports.getNewPlayers = function (cursor, next) {
	var opts = {
		screen_name: "quickquest",
		skip_status: true,
		include_user_entities: false
	};

	if (cursor) opts.cursor = cursor;

	twit.get("/followers/list.json", opts, next);
}

exports.verify = function (next) {
	twit.verifyCredentials(function(data) {
        console.log("Verify", data);
    })
}
