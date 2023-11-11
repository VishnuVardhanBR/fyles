import Logo from "../images/logo.png";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [registerKey, setRegisterKey] = useState("");
	const navigate = useNavigate();

	const handleRegister = (event) => {
		event.preventDefault();
		axios
			.post(process.env.REACT_APP_BACKEND_URL + "/register", {
				username,
				password,
				registerKey,
			})
			.then(() => {
				alert("Registration successful");
				setUsername("");
				setPassword("");
				navigate("/login");
			})
			.catch((error) => {
				alert("Error");
				console.log("Unable to register");
			});
	};

	return (
		<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<img className="mx-auto h-10 w-auto" src={Logo} alt="fyles." />
				<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
					Register an account
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form className="space-y-6" onSubmit={handleRegister} method="POST">
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
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								autoComplete="username"
								required
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
						</div>
						<div className="mt-2">
							<input
								id="password"
								name="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="current-password"
								required
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
								Repeat Password
							</label>
						</div>
						<div className="mt-2">
							<input
								id="password"
								name="repeat-password"
								type="password"
								autoComplete="repeat-password"
								required
								className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
					<div>
						<div className="flex items-center justify-between">
							<label
								htmlFor="register-key"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								Register Key
							</label>
						</div>
						<div className="mt-2">
							<input
								id="register-key"
								name="register-key"
								type="password"
								value={registerKey}
								onChange={(e) => setRegisterKey(e.target.value)}
								required
								className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
						>
							Register
						</button>
					</div>
				</form>

				<p className="mt-5 text-center">
					<a
						href="/login"
						className="font-semibold leading-6 text-black hover:text-gray-700"
					>
						Already have an account?
					</a>
				</p>
			</div>
		</div>
	);
}
