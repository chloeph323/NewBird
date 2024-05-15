const axios = require('axios');
const apiKey = 'AIzaSyBWtTi7IsioMa3TnDRoreLG6SE3fd4p_iY';

async function getUserLocation() {
	try {
		const response = await axios.get('https://ipapi.co/json/');
		if (response.data.latitude && response.data.longitude) {
			const lat = response.data.latitude;
			const lng = response.data.longitude;
			console.log('User coordinates:', lat, lng);
			const reverseGeocodedAddress = await reverseGeocode(
				lat,
				lng,
				apiKey
			);
			return { lat, lng, reverseGeocodedAddress };
		} else {
			console.log('Failed to get user location.');
			return null;
		}
	} catch (error) {
		console.error('Error fetching user location:', error.message);
		return null;
	}
}

async function reverseGeocode(lat, lng, apiKey) {
	try {
		const response = await axios.get(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
		);
		if (response.data.results && response.data.results.length > 0) {
			const address = response.data.results[0].formatted_address;
			return address;
		} else {
			console.log('No results found for the provided coordinates.');
			return null;
		}
	} catch (error) {
		console.error('Error performing reverse geocoding:', error.message);
		return null;
	}
}

module.exports = {
	getUserLocation
};
