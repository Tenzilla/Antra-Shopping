const express = require('express')
const http = require('http')
const path = require('path')
const cors = require('cors')
const fs = require('fs');
const multer = require('multer');
var multerObj = multer();

const app = express()

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(express.json());
app.use(multerObj.array()); 
app.use(express.static('public'));

server = require('http').createServer(app);

app.post('/add-to-cart', cors(corsOptions), function handler(req, res){


	//--get the current data in the db
	fs.readFile('db/db.json', 'utf8', function(err, data) {
		let dbData = data;

		let dbJSON = JSON.parse(dbData)
		dbJSON = dbData.db
		
		let dbJSONCart = dbJSON.cart

		if ( req.body.item == "Apple") {
			dbJSONCart = {...dbJSONCart, ...{ apple: req.body.count, orange: dbJSON.cart.orange }}
		}
		else if ( req.body.item == "Orange") {
			dbJSONCart = {...dbJSONCart, ...{ orange: req.body.count, apple: dbJSON.cart.apple }}
		}

		//--now update db
		db = {...dbJSON, ...{ cart: dbJSONCart, inventory: dbJSON.inventory }}

		var dbText = JSON.stringify({ db });

		fs.writeFileSync('db/db.json', dbText, err => {
		    if(err){
		    	return res.json({status: "error", msg: err})
		    }
		    else{
					return res.json({status: "success", msg: "Cart updated!"});
		    }
		});

	})

	

})

server.listen(80, function() {
    console.log('ready to go!');
});