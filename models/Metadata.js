var mongoose = require("../config/db");

var metadataSchema = new mongoose.Schema({
	nextFollowerCursor: String,
	lastFollowerID: String,
	lastMentionID: String
});

var Metadata = mongoose.model("Metadata", metadataSchema);

//return an instance of metadata. there should
//only be one record of metadata.
exports.get = function(next) {
	Metadata.findOne(function (err, metadata) {
		if (!metadata)
			metadata = new Metadata();

		next(metadata);
	});
};