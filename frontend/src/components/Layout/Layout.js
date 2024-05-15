import React from 'react';
import { Link } from 'react-router-dom';
import './layout.css';

export default function Layout(props) {
	return (
		<div>
			<header>
				<Link to='/quiz'>Quiz</Link>
				<Link to='/bird-log'>Bird Log</Link>
			</header>
			<main>{props.children}</main>
		</div>
	);
}
