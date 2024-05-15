const LocationService = require('../services/locationService');

async function handleGetLocationRequest(req, res) {
	const location = await LocationService.getUserLocation();
	if (location == null) {
		return res
			.status(500)
			.json({ message: 'Error fetching user location' });
	} else {
		return res.status(200).json({
			lat: location.lat,
			lng: location.lng,
			address: location.reverseGeocodedAddress
		});
	}
}

module.exports = {
	handleGetLocationRequest
};
