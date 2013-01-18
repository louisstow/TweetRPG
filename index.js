var twitter = require("./config/twitter");

var metadata = require("./models/Metadata");

//execute this function every minute
function tick () {
	//get the latest commands
	twitter.getMentions(lastID, function (err, result) {
		console.log("getMentions", result);

		//save this id
		lastID = result.length && result[0].id_str;

		for (var i = 0; i < result.length; ++i) {
			var tweet = result[i];	
		}
	});

	//get any new players
	twitter.getNewPlayers(nextCursor, function (err, result) {
		console.log("getNewPlayers", result);
		nextCursor = result.next_cursor_str;
	});
}


function init () {
	metadata.get(function (m) {
		console.log("METADATA", m);
	});

	//every minute, send a request
	//setInterval(tick, 60 * 1000);
	//tick();	
}

init();