const express = require('express');
const helmet = require('helmet');
const cors = require('cors'); // https://www.npmjs.com/package/cors
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Bear = require('./Bears/BearModel');

const server = express();

server.use(helmet()); // https://helmetjs.github.io/
server.use(cors());   // https://medium.com/trisfera/using-cors-in-express-cac7e29b005b
server.use(bodyParser.json());

server.get('/', function(req, res) {
  res.status(200).json({ status: 'API Running' });
});

server.post('/api/bears', (req, res) => {
	const bearInfo = req.body;
	const { species, latinName } = bearInfo;

	if (species && latinName) {
		const bear = new Bear(bearInfo);
		bear.save()
			.then((savedBear) => {
				res.status(201).json(savedBear);
			})
			.catch((err) => {
				res
					.status(500)
					.json({ error: "There was an error while saving the Bear to the Database" });
			});
	} else {
		res
			.status(500)
			.json({ error: 'Please provide both the species and latinName for the Bear' });
	}

})

server.get('/api/bears', (req, res) => {
	Bear
		.find()
		.then((bears) => {
			res
				.status(200)
				.json(bears);
		})
		.catch((err) => {
			res
				.status(500)
				.json({ error: 'The information could not be retreived.' })
		});
})

server.get('/api/bears/:id', (req, res) => {
	const id = req.params.id;
	Bear
		.findById(id)
		.then((bears) => {
			res
				.status(200)
				.json(bears);
		})
		.catch((err) => {
			res
				.status(500)
				.json({ error: 'The information could not be retreived.' })
		});
})

mongoose.connect('mongodb://localhost/BearKeeper')
	.then((db) => {
		console.log(`Successfully Connected to ${db.connections[0].name} Database`);
	})
	.catch((err) => {
		console.error('Database Connection Failed');
	});

const port = process.env.PORT || 5005;
server.listen(port, () => {
  console.log(`API running on http://localhost:${port}.`);
});
