//PACKAGES:
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var OrderSchema = new Schema({
    google_user_id: {
        type: String
    },
    slot_id: {
        type: Schema.ObjectId,
        ref: 'Slot'
    },
    folio: {
        type: String
    },
    vehicle: {
        type: String
    },
    plates: {
        type: String
    },
    minutes_payed: {
        type: Number
    },
    total: {
        type: Number
    },
    status: {
        type: String,
        default: 'open'
    },
    date_needs_out: {
        type: Date,
        default: Date.now
    },
    date_in: {
        type: Date,
        default: Date.now
    },
    date_out: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

OrderSchema.plugin(mongoosePaginate);

//Return the module
module.exports = mongoose.model("Order", OrderSchema);
