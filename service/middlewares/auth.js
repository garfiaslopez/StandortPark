//JSONWEBTOKEN
var jwt = require("jsonwebtoken");

//Config File
var Config = require("./../config/config");

module.exports = {
	isAuthenticated: (req,res,next) => {
		var token = req.headers.authorization;
		if(token){
			jwt.verify(token,Config.key,{ignoreExpiration:true},(err,decoded) => {
				if(err) {
					return res.send({success:false,message:"Corrupt Token."});
				} else {
					req.decoded = decoded;
					next();
				}
			});
		}else{
			return res.send({success:false,message:"No token provided."});
		}
	}
};
