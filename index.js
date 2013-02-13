process.BOT = "questinatweet";

var ff = require("ff");
var express = require("express");

var twitter = require("./config/twitter");

var Player = require("./models/Player");
var Event  = require("./models/Event");

var WELCOME = "Welcome to QuestInATweet. Reply with your commands or send me a DM. Read more: http://quest.webtop.co/instructions"

/**
* Stream any tweet that includes a mention to the 
* twitter bot. Send this command to be parsed.
*/
function connectTweetStream () {
	twitter.stream("statuses/filter", {track: "@" + process.BOT}, function(stream) {
		stream.on("data", function (data) {
			console.log(data);
			var tokens = data.text.split(" ");
			parse({
				tokens: tokens,
				screen_name: data.user.screen_name
			});
		});

		stream.on("destroy", function (response) {
			console.error("***Tweet stream closed");
			console.error(response);
			setTimeout(connectTweetStream, 1000);
		});
	});
}

/**
* Stream user data. This includes new followers and
* direct messages. Auto follow followers so they may
* send commands through direct messages.
*/
function connectUserStream () {
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
					} else {
						twitter.updateStatus(
							"@" + screenName + " " + WELCOME,
							onError
						)
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
					screen_name: data.direct_message.sender_screen_name,
					directMessage: true
				});
			}
		});

		stream.on("destroy", function (response) {
			console.error("***User stream closed");
			console.error(response);
			setTimeout(connectUserStream, 1000);
		});
	});
}

function parse (opts) {
	if (!opts.tokens || !opts.screen_name)
		return console.error("Invalid data object");

	var tokens = opts.tokens;
	var command = tokens[1];
	var screenName = opts.screen_name;

	var action;

	ff(function () {
		Player.findOrCreate(screenName, this.slot());	
	}, function (player) {
		//if the command is roll
		if ((/roll|hitme|go|spin/i).test(command)) {
			this.succeed(Event.roll(player));
			action = "roll";
		} else if ((/attack|fight|battle|kill|destroy/i).test(command)) {
			//make sure the format is correct for attacking
			//e.g. [@questinatweet, attack, @enemy]
			if (tokens.length < 3 || tokens[2][0] !== "@")
				return this.fail({error: "Invalid attack command"});

			//find or create the opponent
			this.pass(player);
			Player.findOrCreate(tokens[2].substr(1), this.slot());
			action = "attack";
		} else {
			this.fail({error: "Invalid command", command: command});
		}
	}, function (player, enemy) {
		this.succeed(Event.attack(player, enemy));
	}).success(function (tweet) {
		console.log("After the event:", tweet);
		if (action === "roll" && opts.directMessage) {
			twitter.newDirectMessage(screenName, tweet, onError);
		} else {
			twitter.updateStatus(tweet, onError)
		}
	}).error(function (err) {
		console.error(err);
	});
}

function onError (err) {
	if (err) {
		console.error(err);
	}
}

//open the streams
connectTweetStream();
connectUserStream();

//setup express
var app = express();
require('./config/server')(app);

//home page
app.get("/", function (req, res) {
	ff(function () {
		Player.find().sort('-xp').limit(20).exec(this.slot());
	}, function (results) {
		res.render("leaderboard", {
			leaderboard: results,
			title: "Leaderboard"
		});
	}).error(function (err) {
		res.json(err);
	});
});

//user page
app.get("/user/:user", function (req, res) {
	ff(function () {
		Player.findOne({handle: req.params.user}, this.slot());
	}, function (player) {
		res.render("profile", {
			profile: player,
			handle: req.params.user,
			title: req.params.user
		});
	}).error(function (err) {
		res.json(err);
	})
});

app.get("/instructions", function (req, res) {
	res.render("instructions", {
		title: "Instructions"
	});
});

app.listen(5602);