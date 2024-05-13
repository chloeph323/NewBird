import React, { useState, useEffect } from 'react';
import './quiz.css'
import axios from 'axios';
import FlashcardList from '../components/FlashcardList';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Retrieve list of all species in the eBird taxonomy
        const speciesResponse = await axios.get('https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json');
        const speciesList = speciesResponse.data;

        // Choose a random species from the list
        const randomSpecies = speciesList[Math.floor(Math.random() * speciesList.length)];
        const birdName = randomSpecies.comName;

        // Use the Flickr API to get public photos of the chosen bird species
        const flickrApiKey = '0a78ea08b8e8c9fc68ea252eea8f713e';
        const flickrApiResponse = await axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrApiKey}&text=${encodeURIComponent(birdName)}&per_page=1&format=json&nojsoncallback=1`);
        const photos = flickrApiResponse.data.photos.photo;

        // Choose a random photo from the list of photos
        const randomPhoto = photos[Math.floor(Math.random() * photos.length)];

        // Check if randomPhoto exists before accessing its properties
        if (randomPhoto) {
          // Construct flashcard with bird image and name
          const flashcard = {
            question: `https://farm${randomPhoto.farm}.staticflickr.com/${randomPhoto.server}/${randomPhoto.id}_${randomPhoto.secret}.jpg`,
            answer: birdName
          };

          setFlashcards([flashcard]);
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
      ) : flashcards.length > 0 ? (
        <>
          <FlashcardList flashcards={flashcards} />
          <button onClick={handleRefresh}>Next</button>
        </>
      ) : null}
    </div>
  );
}

export default App;




// import FlashcardList from '../components/FlashcardList';
// import React, { useState, useEffect, useRef } from 'react';
// import './quiz.css'
// import axios from 'axios'

// export default function Quiz() {
//   const [flashcards, setFlashcards] = useState([])
//   const [categories, setCategories] = useState([])

//   const categoryEl = useRef()
//   const amountEl = useRef()

//   useEffect(() => {
//     axios
//       .get('https://opentdb.com/api_category.php')
//       .then(res => {
//         setCategories(res.data.trivia_categories)
//       })
//   }, [])

//   useEffect(() => {
   
//   }, [])

//   function decodeString(str) {
//     const textArea = document.createElement('textarea')
//     textArea.innerHTML= str
//     return textArea.value
//   }

//   function handleSubmit(e) {
//     e.preventDefault()
//     axios
//     .get('https://opentdb.com/api.php', {
//       params: {
//         amount: amountEl.current.value,
//         category: categoryEl.current.value
//       }
//     })
//     .then(res => {
//       setFlashcards(res.data.results.map((questionItem, index) => {
//         const answer = decodeString(questionItem.correct_answer)
//         const options = [
//           ...questionItem.incorrect_answers.map(a => decodeString(a)),
//           answer
//         ]
//         return {
//           id: `${index}-${Date.now()}`,
//           question: decodeString(questionItem.question),
//           answer: answer,
//           options: options.sort(() => Math.random() - .5)
//         }
//       }))
//     })
//   }

//   return (
//     <>
//       <form className="header" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="category">Location</label>
//           <select id="category" ref={categoryEl}>
//             {categories.map(category => {
//               return <option value={category.id} key={category.id}>{category.name}</option>
//             })}
//           </select>
//         </div>
//         <div className="form-group">
//           <label htmlFor="amount">Number of Cards</label>
//           <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountEl} />
//         </div>
//         <div className="form-group">
//           <button className="btn">Generate</button>
//         </div>
//       </form>
//       <div className="container">
//         <FlashcardList flashcards={flashcards} />
//       </div>
//     </>
//   );
// }

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './quiz.css'
// import FlashcardList from '../components/FlashcardList';
// import { getUserLocation } from '../apis/fetchLocation';

// export default function Quiz() {
//   const [flashcards, setFlashcards] = useState([]);
//   const [location, setLocation] = useState(null);
//   const [error, setError] = useState(null);

//   const amountEl = useRef();

//   useEffect(() => {
//     async function fetchData() {
//       if (!location) return;
//       try {
//         const { lat, lng } = location;

//         const birdApiResponse = await axios.get(`https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${lng}&maxResults=1`, {
//           headers: {
//             'X-eBirdApiToken': 'hkffk564p46f' // Replace with your eBird API token
//           }
//         });

//         const birds = birdApiResponse.data;

//         if (birds.length > 0) {
//           const randomBird = birds[Math.floor(Math.random() * birds.length)];
//           const birdName = randomBird.comName;

//           const flickrApiKey = '0a78ea08b8e8c9fc68ea252eea8f713e';
//           const flickrApiResponse = await axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrApiKey}&text=${encodeURIComponent(birdName)}&per_page=1&format=json&nojsoncallback=1`);
//           const photos = flickrApiResponse.data.photos.photo;

//           if (photos.length > 0) {
//             const randomPhoto = photos[Math.floor(Math.random() * photos.length)];

//             // Construct flashcard with bird image and name
//             const flashcard = {
//               id: `${Date.now()}`, // Use a unique ID
//               question: `https://farm${randomPhoto.farm}.staticflickr.com/${randomPhoto.server}/${randomPhoto.id}_${randomPhoto.secret}.jpg`,
//               answer: birdName
//             };

//             setFlashcards([flashcard]);
//             setError(null); // Reset error state
//           } else {
//             setError('No photos found for the bird');
//           }
//         } else {
//           setError('No bird observations found for the location');
//         }
//       } catch (error) {
//         console.error('Error fetching bird information:', error.message);
//         setError('Error fetching data');
//       }
//     }

//     fetchData();
//   }, [location]);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     const locationData = await getUserLocation();
//     setLocation(locationData);
//   }

//   return (
//     <>
//       <form className="header" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="amount">Number of Cards</label>
//           <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountEl} />
//         </div>
//         <div className="form-group">
//           <button className="btn">Generate</button>
//         </div>
//       </form>
//       {error && <div>Error: {error}</div>}
//       <div className="container">
//         <FlashcardList flashcards={flashcards} />
//       </div>
//     </>
//   );
// }
