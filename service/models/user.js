//PACKAGES:
var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
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
	plates: {
		type: String
	},
	name: {
		type: String
	},
	phone_number: {
		type: String
	},
	email: {
		type: String
	},
	credit_card_number: {
		type: String
	},
	credit_card_ccv: {
		type: String
	},
	credit_card_exp_date: {
		type: String
	},
	credit_card_name: {
		type: String
	},
	date_birth: {
		type: Date
	},
    created: {
        type: Date,
		default: Date.now
    }
});

UserSchema.plugin(mongoosePaginate);

UserSchema.index({
	name: 'text',
	username: 'text',
	email: 'text'
});

module.exports = mongoose.model("User",UserSchema);
