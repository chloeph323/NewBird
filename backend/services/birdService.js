const axios = require('axios');
const db = require('../db/db');

async function getAllBirds() {
	if (!db?.birds) {
		db.birds = (
			await axios.get(
				'https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json'
			)
		).data;
	}

	return db.birds;
}

async function getRandomBird() {
	const speciesList = await getAllBirds();
	const randomSpecies =
		speciesList[Math.floor(Math.random() * speciesList.length - 1)];

	return randomSpecies;
}
async function getBirdImage(birdName) {
	const images = (await getBirdImages(birdName)).images;
	return { birdName, image: images[0] };
}

async function getBirdImages(birdName) {
	try {
		const flickrUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=0a78ea08b8e8c9fc68ea252eea8f713e&text=${encodeURIComponent(
			birdName
		)}&per_page=1&format=json&nojsoncallback=1`;

		const response = await axios.get(flickrUrl);
		const data = response.data;
		const photos = data.photos.photo;
		const images = photos.map(
			(photo) =>
				`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
		);

		return { birdName, images };
	} catch (error) {
		console.error('Error fetching bird image:', error.message);
		return null;
	}
}

async function getManyBirdImages(birdNames) {
	const apiCalls = [];
	birdNames.forEach((birdName) => {
		// Don't await so we can call multiple times at once
		apiCalls.push(getBirdImage(birdName));
	});
	return await Promise.all(apiCalls);
}

async function getBirdCall(birdName) {
	try {
		const url = `https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(
			birdName
		)}`;

		const response = await axios.get(url);
		const data = response.data;

		if (data.numRecordings > 0) {
			const recording = data.recordings[0]; // Assuming you want the first recording
			return { birdName, birdCallUrl: recording.file };
		} else {
			throw new Error(`No recordings found for ${birdName}`);
		}
	} catch (error) {
		console.error('Error fetching bird call:', error.message);
		return null;
	}
}

async function getManyBirdCalls(birdNames) {
	const apiCalls = [];
	birdNames.forEach((birdName) => {
		// Don't await so we can call multiple times at once
		apiCalls.push(getBirdCall(birdName));
	});
	return await Promise.all(apiCalls);
}

async function getBirdsByLocation(lat, lng) {
	try {
		const url = `https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${lng}&maxResults=5`;

		const response = await axios.get(url, {
			headers: {
				'X-eBirdApiToken': 'hkffk564p46f'
			}
		});

		const data = response.data;
		let observationData = [];
		let birdNames = [];
		for (let observation of data) {
			birdNames.push(observation.comName);
			const obs = {
				species: observation.speciesCode,
				commonName: observation.comName,
				date: observation.obsDt
			};
			observationData.push(obs);
		}

		// Get bird info asynchronously to prevent waiting
		const birdPromises = [
			getManyBirdCalls(birdNames),
			getManyBirdImages(birdNames)
		];
		// Await all bird data instead of one by one
		const birdInfo = await Promise.all(birdPromises);
		const birdCalls = birdInfo[0];
		const birdImages = birdInfo[1];
		// Insert bird data into observation data for Frontend by matching bird names
		observationData = observationData.map((obs) => ({
			...obs,
			imageUrl: birdImages.find(
				(birdImage) => birdImage?.birdName === obs.commonName
			)?.image,
			birdCallUrl: birdCalls.find(
				(birdCall) => birdCall?.birdName === obs.commonName
			)?.birdCallUrl
		}));

		return observationData;
	} catch (error) {
		console.error('Error fetching bird observations:', error.message);
		return null;
	}
}

module.exports = {
	getBirdImage,
	getBirdImages,
	getBirdCall,
	getBirdsByLocation,
	getRandomBird
};
