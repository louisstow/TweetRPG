var twitter = require("./config/twitter");

var Metadata = require("./models/Metadata");
var metadata;

//execute this function every minute
function tick () {
	
	ff(function () {
		//get the latest commands
		twitter.getMentions(metadata.lastMentionID, this.slot());	
		//check for new followers
		twitter.getNewPlayers(metadata.nextFollowerCursor, this.slot());
	}, function (mentions, followers) {
		//save this id
		metadata.lastMentionID = result.length && result[0].id_str;

		for (var i = 0; i < result.length; ++i) {
			var tweet = result[i];	
		}

		metadata.nextFollowerCursor = result.next_cursor_str;

		metadata.save();
	});
}


function init () {
	Metadata.get(function (m) {
		console.log("METADATA", m);
		metadata = m;
		tick();
	});

	//every minute, send a request
	//setInterval(tick, 60 * 1000);
	
}

init();