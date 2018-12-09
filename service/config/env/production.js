'use strict';


// SSH : HaQj4UKJpBBddS3N
module.exports = {
    port: 3207,
    app: {
        name: 'API - Production'
    },
    dbMongo: 'mongodb://StandortParkDevUser:CLttFUZthSanAKvm@127.0.0.1:18509/StandortPark',
	  key: "HQR6E2lSA2LuWmxd5Akm"
};


/**

use admin
db.createUser(
  {
    user: "CarwashSuperUser",
    pwd: "CLttFUZthSanAKvm",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)

mongo --port 18509 --username CarwashSuperUser --password CLttFUZthSanAKvm --authenticationDatabase admin

use Nun2x3
db.createUser(
    {
      user: "Enun2x3SuperUser",
      pwd: "CLttFUZthSanAKvm",
      roles: [
         { role: "readWrite", db: "Nun2x3" }
      ]
    }
)



**/
