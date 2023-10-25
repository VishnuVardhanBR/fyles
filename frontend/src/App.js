import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import RegisterPage from "./components/RegisterPage";
// import HomePage from "./components/HomePage";
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export default function App() {
	const isUserLoggedIn = !!localStorage.getItem('token')
	const navigate = useNavigate();
	return (
		<div>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				{isUserLoggedIn && <Route path="/dashboard" element={<Dashboard />} />}
       		</Routes>
		</div>
	);
}
