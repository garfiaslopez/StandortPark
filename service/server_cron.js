'use strict';

//  Module dependencies.
var mongoose = require('mongoose');
var winston = require('winston');
var moment = require('moment');
var bluebird = require('bluebird');

mongoose.Promise = bluebird;

//  Define node env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//  Initializing system variables
var config = require('./config/config');

// Bootstrap MongoDB connection
var dbMongo = mongoose.connect(config.dbMongo, {
    useMongoClient: true,
});

// CHECK THE STATUS OD THE SLOTS.

var errs = require('restify-errors');
var slotsModel = require('./models/slot');
var ordersModel = require('./models/order');

// get al open orders
const actual_date = moment();

ordersModel.find({ status: 'open' }, (err, objs) => {
    if (err) {
        console.log(err);
    } else {
        if (objs.length > 0) {
            objs.forEach((order) => {
                const date_needs_out = moment(order.date_needs_out);
                if (actual_date > date_needs_out) {
                    // expired order
                    order.status = 'expired';
                    order.save();
                    slotsModel.findById(order.slot_id, (err, slot) => {
                        slot.status = 'expired';
                        slot.save();
                        console.log('done checking expired');
                    });
                }
            });
        } else {
            console.log("No hay ordenes")
        }
    }
});

