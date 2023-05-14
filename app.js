const express = require('express')
const http = require('http')
const path = require('path')
const cors = require('cors')
const fs = require('fs');
const multer = require('multer');
var multerObj = multer();

const app = express()

var corsOptions = {
	origin: "http://127.0.0.1:8080",
	optionsSuccessStatus: 200
}

var PORT = 4051;

app.use(cors());
app.use(express.json());
app.use(multerObj.array());
app.use(express.static('public'));

server = require('http').createServer(app);

app.get('/get-cart', cors(corsOptions), function handler(req, res) {
	fs.readFile('db/db.json', 'utf8', function (err, data) {
		let dbJSON = JSON.parse(data)
		return res.json({ status: "success", data: dbJSON.db.cart });
	})
})


app.get('/get-inventory', cors(corsOptions), function handler(req, res) {
	fs.readFile('db/db.json', 'utf8', function (err, data) {
		let dbJSON = JSON.parse(data)
		return res.json({ status: "success", data: dbJSON.db.inventory });
	})
})


app.post('/add-to-cart', cors(corsOptions), function handler(req, res) {


	//--get the current data in the db
	fs.readFile('db/db.json', 'utf8', function (err, data) {
		let dbJSON = JSON.parse(data)
		dbJSON = dbJSON.db

		let dbJSONCart = dbJSON.cart

		if (req.body.item == "Apple") {
			dbJSONCart = { ...dbJSONCart, ...{ apple: parseInt(dbJSON.cart.apple) + parseInt(req.body.count), orange: parseInt(dbJSON.cart.orange) } }
		}
		else if (req.body.item == "Orange") {
			dbJSONCart = { ...dbJSONCart, ...{ orange: parseInt(dbJSON.cart.orange) + parseInt(req.body.count), apple: parseInt(dbJSON.cart.apple) } }
		}

		//--now update db
		db = { ...dbJSON, ...{ cart: dbJSONCart, inventory: dbJSON.inventory } }

		var dbText = JSON.stringify({ db });

		fs.writeFileSync('db/db.json', dbText, err => {
			if (err) {
				return res.json({ status: "error", msg: err })
			}
			else {
				return res.json({ status: "success", msg: "Cart updated!" });
			}
		});

	})

})


app.delete('/delete-from-cart', cors(corsOptions), function handler(req, res) {

	//--get the current data in the db
	fs.readFile('db/db.json', 'utf8', function (err, data) {
		let dbJSON = JSON.parse(data)
		dbJSON = dbJSON.db

		let dbJSONCart = dbJSON.cart

		if (req.body.item == "Apple") {
			dbJSONCart = { ...dbJSONCart, ...{ apple: 0, orange: dbJSON.cart.orange } }
		}
		else if (req.body.item == "Orange") {
			dbJSONCart = { ...dbJSONCart, ...{ orange: 0, apple: dbJSON.cart.apple } }
		}

		//--now update db
		db = { ...dbJSON, ...{ cart: dbJSONCart, inventory: dbJSON.inventory } }

		var dbText = JSON.stringify({ db });

		fs.writeFileSync('db/db.json', dbText, err => {
			if (err) {
				return res.json({ status: "error", msg: err })
			}
			else {
				return res.json({ status: "success", msg: "Cart updated!" });
			}
		});

	})

})



server.listen(PORT, function () {
	console.log('Server listening on PORT', PORT);
});
//testing git command 