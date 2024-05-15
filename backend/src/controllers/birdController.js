const BirdService = require('../services/birdService');

async function handleGetRandomBird(req, res) {
	const bird = await BirdService.getRandomBird();
	return res.status(200).json(bird);
}

async function handleGetBirdImageByName(req, res) {
	const birdName = req.query.birdName;
	if (!birdName) {
		return res
			.status(400)
			.json({ message: 'Bad Request: Please include birdName in query' });
	}

	const birdImage = await BirdService.getBirdImage(birdName);

	if (birdImage == null) {
		return res.status(404).json({ message: 'Bird not found' });
	}

	return res.status(200).json(birdImage);
}

async function handleGetBirdImagesByName(req, res) {
	const birdName = req.query.birdName;
	if (!birdName) {
		return res
			.status(400)
			.json({ message: 'Bad Request: Please include birdName in query' });
	}

	const birdImages = await BirdService.getBirdImages(birdName);

	if (birdImages == null) {
		return res.status(404).json({ message: 'Bird not found' });
	}

	return res.status(200).json(birdImages);
}

async function handleGetBirdCallByName(req, res) {
	const birdName = req.query.birdName;
	if (!birdName) {
		return res
			.status(400)
			.json({ message: 'Bad Request: Please include birdName in query' });
	}

	let birdCall = await BirdService.getBirdImage(birdName);

	if (birdCall == null) {
		return res.status(404).json({ message: 'Bird call not found' });
	}

	return res.status(200).json(birdCall);
}

async function handleGetBirdsByLocation(req, res) {
	const { lat, lng } = req.query;
	if (!lat || !lng) {
		return res.status(400).json({
			message: 'Bad Request: Please include lat and lng in query'
		});
	}

	const birds = await BirdService.getBirdsByLocation(lat, lng);

	if (!birds) {
		return res.status(404).json({ message: 'No birds in area found' });
	}

	return res.status(200).json(birds);
}

module.exports = {
	handleGetBirdImageByName,
	handleGetBirdCallByName,
	handleGetBirdsByLocation,
	handleGetBirdImagesByName,
	handleGetRandomBird
};
