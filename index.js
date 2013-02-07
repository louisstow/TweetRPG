process.BOT = "questinatweet";

var ff = require("ff");
var twitter = require("./config/twitter");

var Player = require("./models/Player");
var Event  = require("./models/Event");

/**
* Stream any tweet that includes a mention to the 
* twitter bot. Send this command to be parsed.
*/
twitter.stream("statuses/filter", {track: "@" + process.BOT}, function(stream) {
	stream.on("data", function (data) {
		console.log(data);
		var tokens = data.text.split(" ");
		parse({
			tokens: tokens,
			screen_name: data.user.screen_name
		});
	});
});

/**
* Stream user data. This includes new followers and
* direct messages. Auto follow followers so they may
* send commands through direct messages.
*/
twitter.stream("user", function (stream) {
	stream.on("data", function (data) {
		//auto follow them back to allow DMs
		console.log(data);
		if (data.event === "follow") {
			var screenName = data.source.screen_name;

			//don't attempt to follow ourself
			if (screenName === process.BOT)
				return;

			console.log("New follower", screenName)
			twitter.createFriendship(screenName, function (err) {
				if (err) {
					console.error("Error trying to follow", screenName);
					console.error(err);
				}
			});
		}
		//allow commands from direct messages 
		else if (data.direct_message) {
			//create the token object as if from a mention
			var tokens = data.direct_message.text.split(" ");
			tokens.unshift("@" + process.BOT);

			parse({
				tokens: tokens,
				screen_name: data.direct_message.sender_screen_name
			});
		}
	});
});

function parse (opts) {
	if (!opts.tokens || !opts.screen_name)
		return console.error("Invalid data object");

	var tokens = opts.tokens;
	var command = tokens[1];
	var screenName = opts.screen_name;

	ff(function () {
		Player.findOrCreate(screenName, this.slot());	
	}, function (player) {
		//if the command is roll
		if ((/roll/i).test(command)) {
			this.succeed(Event.roll(player));
		} else if ((/attack|fight|battle/i).test(command)) {
			//make sure the format is correct for attacking
			//e.g. [@questinatweet, attack, @enemy]
			if (tokens.length < 3 || tokens[2][0] !== "@")
				return this.fail({error: "Invalid attack command"});

			//find or create the opponent
			this.pass(player);
			Player.findOrCreate(tokens[2].substr(1), this.slot())
		} else {
			this.fail({error: "Invalid command"});
		}
	}, function (player, enemy) {
		this.succeed(Event.attack(player, enemy));
	}).success(function (tweet) {
		console.log("After the event:", tweet);
	}).error(function (err) {
		console.error(err);
	});
}

//export internal method for testing
exports.parse = parse;