import DownloadIcon from "../images/circle-down-solid.png";
import DeleteIcon from "../images/trash-solid.png";
import LinkIcon from "../images/link-solid.png";
import React, { useState, useEffect } from "react";
import LogoImage from "../images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatBytes, formatDate } from "../Utils.js";

export default function Dashboard() {
	// const isUserLoggedIn = !!localStorage.getItem('token')
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");

		navigate("/login");
	};

	const [files, setFiles] = useState([]);
	const [uploading, setUploading] = useState(false);

	const fetchS3Objects = async () => {
		try {
			const response = await fetch(
				process.env.REACT_APP_BACKEND_URL + "/listobjects",
				{
					headers: { Authorization: localStorage.getItem("token") },
				}
			);
			if (response.ok) {
				const data = await response.json();
				setFiles(data);
			} else {
				throw new Error("Network response was not ok");
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		// console.log(localStorage.getItem("token"))
		fetchS3Objects();
	}, []);

	const handleUpload = async (event) => {
		// console.log(localStorage.getItem("token"));
		const file = event.target.files[0];
		const formData = new FormData();
		formData.append("file", file);
		setUploading(true);
		try {
			const response = await fetch(
				process.env.REACT_APP_BACKEND_URL + "/uploadobject",
				{
					method: "POST",
					body: formData,
					headers: { Authorization: localStorage.getItem("token") },
				}
			);
			fetchS3Objects();
			setUploading(false);
		} catch (error) {
			// Handle error
		}
	};

	const handleDownload = async (filename) => {
		try {
			const response = await fetch(
				process.env.REACT_APP_BACKEND_URL + "/generatepresignedurl",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: localStorage.getItem("token"),
					},
					body: JSON.stringify({
						filename: filename,
					}),
				}
			);
			const data = await response.json();
			window.location.href = data.url;
		} catch (error) {
			// Handle error
		}
	};

	const handleUrl = async (filename) => {
		try {
			const response = await fetch(
				process.env.REACT_APP_BACKEND_URL + "/generatepresignedurl",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: localStorage.getItem("token"),
					},
					body: JSON.stringify({
						filename: filename,
					}),
				}
			);
			const data = await response.json();
			const tempInput = document.createElement("input");
			tempInput.value = data.url;
			document.body.appendChild(tempInput);
			tempInput.select();
			document.execCommand("copy");
			document.body.removeChild(tempInput);
		} catch (error) {
			// Handle error
		}
	};
	const handleDelete = async (filename) => {
		try {
			const response = await fetch(
				process.env.REACT_APP_BACKEND_URL + "/deleteobject",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: localStorage.getItem("token"),
					},
					body: JSON.stringify({
						filename: filename,
					}),
				}
			);
			fetchS3Objects();
		} catch {}
	};
	return (
		<div className="mt-5 max-w-screen-xl mx-auto px-4 md:px-8">
			<div className="flex flex-row  items-start justify-between">
				<div className="flex items-center hover:scale-125 transition-all">
					<img src={LogoImage} alt="Logo" className="h-8 mr-2" />{" "}
					<h4
						href="/"
						className="cursor-pointer text-gray-800 text-2xl font-bold"
					>
						fyles.
					</h4>
				</div>
				<div className="mt-0 flex items-center text-sm">
					<label
						htmlFor="file-input"
						className={`cursor-pointer inline-block px-4 py-2 text-black duration-150 font-medium bg-gray-300 rounded-lg ${
							uploading ? "animate-pulse" : "hover:drop-shadow-2xl"
						}`}
					>
						{uploading ? "Uploading..." : "Add File"}
					</label>
					<input
						id="file-input"
						type="file"
						className="hidden"
						onChange={handleUpload}
						disabled={uploading}
					/>

					<button className="pl-3" onClick={handleLogout}>
						<svg
							className="w-5 h-5 text-black "
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 18 15"
						>
							{" "}
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M1 7.5h11m0 0L8 3.786M12 7.5l-4 3.714M12 1h3c.53 0 1.04.196 1.414.544.375.348.586.82.586 1.313v9.286c0 .492-.21.965-.586 1.313A2.081 2.081 0 0 1 15 14h-3"
							/>{" "}
						</svg>
					</button>
				</div>
			</div>
			<div className="mt-12 relative h-max overflow-auto">
				<table className="w-full table-auto text-sm text-left">
					<thead className="text-gray-600 font-medium border-b">
						<tr>
							<th className="py-3 pr-6">Name</th>
							<th className="py-3 pr-6">Date Added</th>
							<th className="py-3 pr-6">Added By</th>
							<th className="py-3 pr-6">File Size</th>
							<th className="py-3">Actions</th>
						</tr>
					</thead>
					<tbody className="text-gray-600 divide-y">
						{files.map((file, index) => (
							<tr key={index}>
								<td
									className="pr-6 py-4 whitespace-nowrap text-ellipsis overflow-hidden max-w-xs"
									style={{ maxWidth: "200px" }}
								>
									{file.Key.split("/")[1].length > 32
										? `${file.Key.split("/")[1].substring(0, 29)}...`
										: file.Key.split("/")[1]}
								</td>
								<td className="pr-6 py-4 whitespace-nowrap">
									{formatDate(file.LastModified)}
								</td>
								<td className="pr-6 py-4 whitespace-nowrap">
									{file.Key.split("/")[0]}
								</td>
								<td className="pr-6 py-4 whitespace-nowrap">
									{formatBytes(file.Size)}
								</td>
								{/* Icons container */}
								<td className="py-4 flex justify-start space-x-4">
									<img
										src={DownloadIcon}
										alt="Download"
										onClick={() => handleDownload(file.Key.split("/")[1])}
										className="cursor-pointer h-5 hover:scale-125 transition-all"
									/>
									<img
										src={DeleteIcon}
										alt="Delete"
										onClick={() => handleDelete(file.Key.split("/")[1])}
										className="cursor-pointer h-5 hover:scale-125 transition-all"
									/>
									<img
										src={LinkIcon}
										onClick={() => handleUrl(file.Key.split("/")[1])}
										alt="Link"
										className="cursor-pointer h-5 hover:scale-125 transition-all"
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
