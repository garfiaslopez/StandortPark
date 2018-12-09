//PACKAGES:
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var SlotSchema = new Schema({
	user_id: {
        type: Schema.ObjectId,
        ref: 'User'
    },
	denomination: {
		type: String,
		unique: true,
		required: true,
		uppercase: true,
		trim: true
	},
	address: {
    	type: String
    },
	location: {
        type: {
			type: String, 
			default: 'Point' 
		},
        coordinates: { 
			type: [Number], 
			default: [0, 0] 
		}
    },
    created: {
        type: Date,
		default: Date.now
    },
	status: {
    	type: String,
    	default: "active"
    }
});

SlotSchema.plugin(mongoosePaginate);

SlotSchema.index({
	location: '2dsphere'
});

//Return the module
module.exports = mongoose.model("Slot", SlotSchema);
