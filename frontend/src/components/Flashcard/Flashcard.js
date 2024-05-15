import React, { useState, useEffect, useRef } from 'react';
import './flashcard.css';

export default function Flashcard({ flashcard }) {
	const [flip, setFlip] = useState(false);
	const [height, setHeight] = useState('25%');
	const [width, setWidth] = useState('25%');

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
			style={{ height: height * 2, width: width * 25 }}
			onClick={() => setFlip(!flip)}
		>
			<div className='front' ref={frontEl}>
				<img src={flashcard.question} alt='Bird' />
			</div>
			<div className='back' ref={backEl}>
				{flashcard.answer}
			</div>
		</div>
	);
}
