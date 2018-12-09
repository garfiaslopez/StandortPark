//PACKAGES:
var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var UserSystemSchema = new Schema({
	username: {
		type: String,
		trim: true,
		required: true,
        unique: true
	},
	password: {
		type: String,
		required: true
	},
	name: {
		type: String
	},
    created: {
        type: Date,
		default: Date.now
    }
});

UserSystemSchema.plugin(mongoosePaginate);

UserSystemSchema.index({
	name: 'text',
	username: 'text',
	email: 'text'
});

module.exports = mongoose.model("UserSystem",UserSystemSchema);
