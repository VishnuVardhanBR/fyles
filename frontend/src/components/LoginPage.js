import Logo from "../images/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// require("dotenv").config();

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			// console.log(process.env.REACT_APP_BACKEND_URL + "/login");
			const response = await axios.post(
				process.env.REACT_APP_BACKEND_URL + "/login",
				{
					username,
					password,
				}
			);
			alert("Login Successful");
			const token = response.data.token;
			setUsername("");
			setPassword("");
			localStorage.setItem("token", token);
			navigate("/dashboard");
			window.location.reload();
		} catch (error) {
			alert("Error while logging in");
			// console.log("Error while logging in" + error);
		}
	};

	return (
		<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<img className="mx-auto h-10 w-auto" src={Logo} alt="fyles." />
				<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
					Sign in to your account
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form className="space-y-6" onSubmit={handleLogin} method="POST">
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium leading-6 text-gray-900"
						>
							Username
						</label>
						<div className="mt-2">
							<input
								id="username"
								name="username"
								type="text"
								autoComplete="username"
								required
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between">
							<label
								htmlFor="password"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								Password
							</label>
							<div className="text-sm">
								<a
									href="/"
									className="text-xs font-semibold text-gray-500 hover:text-gray-700"
								>
									Forgot password?
								</a>
							</div>
						</div>
						<div className="mt-2">
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
						>
							Sign in
						</button>
					</div>
				</form>

				<p className="mt-10 text-center">
					<a
						href="/register"
						className="font-semibold leading-6 text-black hover:text-gray-700"
					>
						New here?
					</a>
				</p>
			</div>
		</div>
	);
}
