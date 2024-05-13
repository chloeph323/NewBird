import axios from 'axios';

class BirdObservation {
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.sightingsCounter = {};
    }

    async fetchAndPrintRecentObservations() {
        try {
            const url = `https://api.ebird.org/v2/data/obs/geo/recent?lat=${this.latitude}&lng=${this.longitude}&maxResults=5`;

            const response = await axios.get(url, {
                headers: {
                    'X-eBirdApiToken': 'hkffk564p46f'
                }
            });

            const data = response.data;

            const observations = data.map(observation => ({
                species: observation.speciesCode,
                commonName: observation.comName,
                date: observation.obsDt
            }));

            console.log('Last five birds observed in the area:');
            observations.forEach((observation, index) => {
                console.log(`${index + 1}. Species: ${observation.species}, Common Name: ${observation.commonName}, Date: ${observation.date}`);
            });

            return observations.map(observation => observation.commonName);
        } catch (error) {
            console.error('Error fetching bird observations:', error.message);
            throw error;
        }
    }

    async fetchBirdImage(commonName) {
        try {
            const flickrUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=0a78ea08b8e8c9fc68ea252eea8f713e&text=${encodeURIComponent(commonName)}&per_page=1&format=json&nojsoncallback=1`;

            const response = await axios.get(flickrUrl);
            const data = response.data;
            const photo = data.photos.photo[0];

            const imageUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;

            return imageUrl;
        } catch (error) {
            console.error('Error fetching bird image:', error.message);
            throw error;
        }
    }

    async fetchBirdCall(commonName) {
        try {
            const query = encodeURIComponent(commonName);
            const url = `https://xeno-canto.org/api/2/recordings?query=${query}`;

            const response = await axios.get(url);
            const data = response.data;

            if (data.numRecordings > 0) {
                const recording = data.recordings[0]; // Assuming you want the first recording
                return recording.file;
            } else {
                throw new Error(`No recordings found for ${commonName}`);
            }
        } catch (error) {
            console.error('Error fetching bird call:', error.message);
            throw error;
        }
    }

}

export default BirdObservation;
