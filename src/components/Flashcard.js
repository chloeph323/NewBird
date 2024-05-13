// import React, { useState, useEffect, useRef } from 'react'

// export default function Flashcard({ flashcard }) {
//   const [flip, setFlip] = useState(false)
//   const [height, setHeight] = useState('initial')

//   const frontEl = useRef()
//   const backEl = useRef()

//   function setMaxHeight() {
//     const frontHeight = frontEl.current.getBoundingClientRect().height
//     const backHeight = backEl.current.getBoundingClientRect().height
//     setHeight(Math.max(frontHeight, backHeight, 100))
//   }

//   useEffect(setMaxHeight, [flashcard.question, flashcard.answer, flashcard.options])
//   useEffect(() => {
//     window.addEventListener('resize', setMaxHeight)
//     return () => window.removeEventListener('resize', setMaxHeight)
//   }, [])

//   return (
//     <div
//       className={`card ${flip ? 'flip' : ''}`}
//       style={{ height: height }}
//       onClick={() => setFlip(!flip)}
//     >
//       <div className="front" ref={frontEl}>
//         {flashcard.question}
//         <div className="flashcard-options">
//           {flashcard.options.map(option => {
//             return <div className="flashcard-option" key={option}>{option}</div>
//           })}
//         </div>
//       </div>
//       <div className="back" ref={backEl}>{flashcard.answer}</div>
//     </div>
//   )
// }

import React, { useState, useEffect, useRef } from 'react';

export default function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState('initial');
  const [width, setWidth] = useState('initial');

  const frontEl = useRef();
  const backEl = useRef();

  function setMaxHeightAndWidth() {
    const frontHeight = frontEl.current.getBoundingClientRect().height;
    const backHeight = backEl.current.getBoundingClientRect().height;
    const frontWidth = frontEl.current.getBoundingClientRect().width;
    setHeight(Math.max(frontHeight, backHeight, 100));
    setWidth(frontWidth); // Set the width to match the image width
  }

  useEffect(setMaxHeightAndWidth, [flashcard.question, flashcard.answer]);
  useEffect(() => {
    window.addEventListener('resize', setMaxHeightAndWidth);
    return () => window.removeEventListener('resize', setMaxHeightAndWidth);
  }, []);

  return (
    <div
      className={`card ${flip ? 'flip' : ''}`}
      style={{ height: height, width: width }}
      onClick={() => setFlip(!flip)}
    >
      <div className="front" ref={frontEl}>
        <img src={flashcard.question} alt="Bird" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="back" ref={backEl}>{flashcard.answer}</div>
    </div>
  );
}