import React, { useState, useEffect } from 'react';
import { getUserLocation } from '../apis/fetchLocation';
import BirdObservation from '../apis/fetchBirdObservations';

const BirdLog = () => {
    const [location, setLocation] = useState(null);
    const [observations, setObservations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get user's location
                const userLocation = await getUserLocation();
                setLocation(userLocation);

                // Fetch bird observations if location is available
                if (userLocation) {
                    const birdObservation = new BirdObservation(userLocation.lat, userLocation.lng);
                    const recentObservations = await birdObservation.fetchAndPrintRecentObservations();

                    // Fetch image and bird call for each observation
                    const observationsWithData = await Promise.all(recentObservations.map(async (commonName) => {
                        const imageUrl = await birdObservation.fetchBirdImage(commonName);
                        const birdCallUrl = await birdObservation.fetchBirdCall(commonName);
                        return { commonName, imageUrl, birdCallUrl };
                    }));

                    setObservations(observationsWithData);
                }
            } catch (error) {
                setError('Error fetching data');
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Bird Log</h1>
            {error && <p>Error: {error}</p>}
            {location && (
                <p>
                    Your current location is: {location.lat}, {location.lng}
                </p>
            )}
            <ul>
                {observations.map((observation, index) => (
                    <li key={index}>
                        <div>
                            <p>Species: {observation.commonName}</p>
                            <img src={observation.imageUrl} alt={observation.commonName} style={{ width: '200px', height: '200px' }} />
                            <audio controls>
                                <source src={observation.birdCallUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BirdLog;
