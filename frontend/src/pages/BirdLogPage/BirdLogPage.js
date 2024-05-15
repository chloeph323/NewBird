import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading/Loading';
import axios from 'axios';
const BirdLog = () => {
	const [location, setLocation] = useState(null);
	const [observations, setObservations] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Get user's location
				const userLocation = (
					await axios.get('http://localhost:8080/location')
				).data;
				setLocation(userLocation);

				// Fetch bird observations if location is available
				if (userLocation) {
					const recentObservations = (
						await axios.get(
							`http://localhost:8080/birdsByLocation?lat=${userLocation.lat}&lng=${userLocation.lng}`
						)
					).data;

					setObservations(recentObservations);
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
					Your current location is: {location.lat}, {location.lng},{' '}
					{location.address}
				</p>
			)}
			<ul>
				{observations ? (
					observations?.map((observation, index) => (
						<li key={index}>
							<div>
								<p>Species: {observation.commonName}</p>
								<img
									src={observation.imageUrl}
									alt={observation.commonName}
									style={{ width: '200px', height: '200px' }}
								/>
								<audio controls>
									<source
										src={observation.birdCallUrl}
										type='audio/mpeg'
									/>
									Your browser does not support the audio
									element.
								</audio>
							</div>
						</li>
					))
				) : (
					<Loading />
				)}
			</ul>
		</div>
	);
};

export default BirdLog;
