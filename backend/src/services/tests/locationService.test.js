const chai = require('chai');
const chaiHttp = require('chai-http');
const LocationService = require('../locationService');
const nock = require('nock');

chai.use(chaiHttp);

describe('LocationService', () => {
	describe('getUserLocation', () => {
		it('should return the user location', async () => {
			nock('https://ipapi.co')
				.get('/json')
				.reply(200, { latitude: 123, longitude: 321 });
			nock('https://maps.googleapis.com')
				.get('/maps/api/geocode/json')
				.query((q) => {
					return q.latlng === '123,321';
				})
				.reply(200, {
					results: [{ formatted_address: '567 West Yangsi Road' }]
				});

			const location = await LocationService.getUserLocation();
			chai.assert.deepEqual(location, {
				lat: 123,
				lng: 321,
				reverseGeocodedAddress: '567 West Yangsi Road'
			});
		});

		it('should return null if it failed to get user location', async () => {
			nock('https://ipapi.co').get('/json').reply(200, {});
			const location = await LocationService.getUserLocation();
			chai.assert.isNull(location);
		});

		it('should return null if it errored while getting user location', async () => {
			nock('https://ipapi.co').get('/json').replyWithError('err');
			const location = await LocationService.getUserLocation();
			chai.assert.isNull(location);
		});
	});

	describe('reverseGeocode', () => {
		it('should return the formatted address', async () => {
			nock('https://maps.googleapis.com')
				.get('/maps/api/geocode/json')
				.query((q) => {
					return q.latlng === '123,321' && q.key === 'apiKey';
				})
				.reply(200, {
					results: [{ formatted_address: '567 West Yangsi Road' }]
				});

			const address = await LocationService.reverseGeocode(
				'123',
				'321',
				'apiKey'
			);
			chai.assert.equal(address, '567 West Yangsi Road');
		});

		it('should return null if there was no formatted address found', async () => {
			nock('https://maps.googleapis.com')
				.get('/maps/api/geocode/json')
				.query((q) => {
					return q.latlng === '123,321';
				})
				.reply(200, {
					results: []
				});

			const address = await LocationService.reverseGeocode(
				'123',
				'321',
				'apiKey'
			);
			chai.assert.isNull(address);
		});

		it('should return null if there was an error', async () => {
			nock('https://maps.googleapis.com')
				.get('/maps/api/geocode/json')
				.query((q) => {
					return q.latlng === '123,321' && q.apikey === 'apiKey';
				})
				.replyWithError('error');

			const address = await LocationService.reverseGeocode(
				'123',
				'321',
				'apiKey'
			);
			chai.assert.isNull(address);
		});
	});
});
