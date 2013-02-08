var path = require("path");
var express = require("express");

module.exports = function (app) {
	app.set('views', path.resolve('./views'));
	app.set('view engine', 'jade');
	app.set('view options', {layout: false});

	app.use(express.static("./public", { maxAge: 1 }));
}