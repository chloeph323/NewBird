import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import BirdLogPage from './pages/BirdLogPage/BirdLogPage';
import QuizPage from './pages/QuizPage/QuizPage';
import Layout from './components/Layout/Layout';

export default function App() {
	return (
		<div>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route index element={<HomePage />} />
						<Route path='/quiz' element={<QuizPage />} />
						<Route path='/bird-log' element={<BirdLogPage />} />
					</Routes>
				</Layout>
			</BrowserRouter>
		</div>
	);
}
