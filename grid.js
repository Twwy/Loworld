//-----<start>----config---------

var timeSpeed = 1440;
var weatherInterval = 60 * 60 * 1000 / timeSpeed;







//------<end>-----config-----------

//-------environment--------------------
var env = {
	"sun": 0,
	""
}

//require
var request = require("request");
var sqlite3 = require('sqlite3').verbose();

//get grid coordinate
if(typeof(process.argv[2]) == "undefined" || typeof(process.argv[3]) == "undefined"){
	console.log("Missing X OR Y!");
	process.exit();
}else{
	x = process.argv[2]; 
	y = process.argv[3]; 
}

//open the database
var db = new sqlite3.Database('./grids/'+x+'/'+x+y+'/resource.db', sqlite3.OPEN_READWRITE,function(err){
	if(err != null){
		console.log(err);
		process.exit();
	}else console.log('Open database success!');
});

//get weather
setInterval(function(){
	request({url:"http://127.0.0.1/earth/weather.php?x="+x+"&y="+y, json:true}, function(error, response, body) {
		env.sun = body.sun;
		//rain
		if(body.rain != 0){
			db.run("UPDATE environment SET value = value + ? WHERE name = 'water'", [body.rain], function(err){
				if(err != null) console.log(err);
				else console.log("water+"+body.rain);
			});
		}
	});
}, weatherInterval);

//plant from database




// request({url:"http://127.0.0.1/earth/sun.php?x="+x+"&y="+y, json:true}, function(error, response, body) {
// 	console.log(body);
// });

// console.log(process.argv[2]);
//获取日照信息

// console.log(123);