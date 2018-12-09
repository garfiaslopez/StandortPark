var mongoose = require('mongoose');
var bluebird = require('bluebird');
mongoose.Promise = bluebird;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
//  Initializing system variables
var config = require('../config');
// Bootstrap MongoDB connection
var dbMongo = mongoose.connect(config.dbMongo, {
    useMongoClient: true,
});

var accountModel = require('../../models/account');
var subsidiaryModel = require('../../models/subsidiary');
var userModel = require('../../models/user');

let account = new accountModel();
let subsidiary = new subsidiaryModel();
let user = new userModel();

account.denomination = "Brake One";
account.fiscal_data = {
    name: "Brake One S.A de C.V",
    phone: "3332221212",
    address: "Some place on earth",
    rfc: "BAOKNE01192FC"
};
account.save((err, savedAcc) => {
    if (err) {
        console.log(err);
    } else {
        subsidiary.account_id = savedAcc._id;
        subsidiary.denomination = "PORTALES";
        subsidiary.phone = "2220202202";
        subsidiary.address = "Some portales address";
        subsidiary.save((err, savedSub) => {
            if (err) {
                console.log(err);
            } else {
                user.account_id = savedAcc._id;
                user.subsidiary_id = [savedSub._id];
                user.rol = "admin";
                user.username = "garfiaslopez";
                user.password = "jose12";
                user.name = "JOSE DE JESUS";
                user.nickname = "JOSE";
                user.save((err, savedUser) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Successfully");
                        console.log(savedUser);
                    }
                });
            }
        });
    }
});


