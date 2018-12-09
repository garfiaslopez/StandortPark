var mongoose = require("mongoose");
var bluebird = require('bluebird');
mongoose.Promise = bluebird;
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
//  Initializing system variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config');
// Bootstrap MongoDB connection
var dbMongo = mongoose.connect(config.dbMongo, {
    useMongoClient: true,
});

var objectModel = require('../models/user');

for (let i = 51; i<5000; i++) {
    console.log(i);
    let obj = new objectModel();
    obj.nickname = "JOSE";
    obj.name = "JOSE DE JESUS";
    obj.password = "JOSE12";
    obj.username = "user_" + i;
    obj.account_id = ObjectId("5b79c3755526c91360058100");
    obj.status = "active";
    obj.rol = "admin";
    obj.subsidiary_id = [
        ObjectId("5b79c3755526c91360058101")
    ];
    obj.save((err, savedObj) => {
        if (err) {
            if (err.code == 11000) {
                console.log("Ya existe este registro en la base de datos.");
            } else {
                console.log(err);
            }
        } else {
            console.log("Success created" + savedObj._id);
        }
    });

}