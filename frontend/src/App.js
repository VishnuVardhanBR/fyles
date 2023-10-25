import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import RegisterPage from "./components/RegisterPage";
import HomePage from "./components/HomePage";
import { Routes, Route } from 'react-router-dom';

export default function App() {
	return (
		<div>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/dashboard" element={<Dashboard />} />
       		</Routes>
		</div>
	);
}
