import React, { useState, useEffect } from 'react';
import './quizPage.css';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import Flashcard from '../../components/Flashcard/Flashcard';

function QuizPage() {
	const [flashcard, setFlashcard] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const randomBird = (
					await axios.get('http://localhost:8080/randomBird')
				).data;
				const birdName = randomBird.comName;

				const photos = (
					await axios.get(
						'http://localhost:8080/birdImagesByName?birdName=' +
							encodeURIComponent(birdName)
					)
				).data.images;

				// Choose a random photo from the list of photos
				const randomPhoto =
					photos[Math.floor(Math.random() * photos.length)];

				// Check if randomPhoto exists before accessing its properties
				if (randomPhoto) {
					// Construct flashcard with bird image and name
					const flashcard = {
						question: randomPhoto,
						answer: birdName
					};

					setFlashcard(flashcard);
				}

				setLoading(false); // Set loading to false after data is fetched
			} catch (error) {
				console.error('Error fetching data:', error.message);
				setLoading(false); // Set loading to false even if there's an error
			}
		}

		fetchData();
	}, []);

	function handleRefresh() {
		setLoading(true); // Set loading to true when refreshing
		window.location.reload();
	}

	return (
		<div>
			<h1>Learn</h1>
			{loading ? (
				<p>Loading...</p>
			) : flashcard ? (
				<div className='flashcards'>
					<Flashcard flashcard={flashcard} />
					<button onClick={handleRefresh}>Next</button>
				</div>
			) : (
				<Loading />
			)}
		</div>
	);
}

export default QuizPage;
