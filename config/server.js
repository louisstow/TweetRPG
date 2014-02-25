var path = require("path");
var express = require("express");

module.exports = function (app) {
	app.set('views', path.resolve(__dirname + '/../views'));
	app.set('view engine', 'jade');
	app.set('view options', {layout: false});

	app.use(express.static(__dirname + "/../public", { maxAge: 1 }));
}