'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const LocationController = require('./controllers/locationController');
const AuthController = require('./controllers/authController');
const BirdController = require('./controllers/birdController');

const app = express();

const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(
	fileUpload({
		createParentPath: true
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const buildPath = path.resolve(__dirname, '../frontend/build');
const index = path.join(buildPath, 'index.html');
app.use(express.static(buildPath));

app.get('/', (req, res) => {
	res.sendFile(index);
});

app.get('/login', AuthController.handleLogin);
app.get('/auth/callback', AuthController.handleLoginRedirect);

app.get('/location', LocationController.handleGetLocationRequest);

app.get('/randomBird', BirdController.handleGetRandomBird);
app.get('/birdImageByName', BirdController.handleGetBirdImageByName);
app.get('/birdImagesByName', BirdController.handleGetBirdImagesByName);
app.get('/birdCallByName', BirdController.handleGetBirdCallByName);
app.get('/birdsByLocation', BirdController.handleGetBirdsByLocation);

app.listen(8080, () => {
	console.log('Server is running on port 8080');
});
