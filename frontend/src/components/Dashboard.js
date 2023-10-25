import DownloadIcon from "../images/circle-down-solid.png";
import DeleteIcon from "../images/trash-solid.png";
import LinkIcon from "../images/link-solid.png";
import React, { useState, useEffect } from "react";
import LogoImage from "../images/logo.png";
import {
	listS3Objects,
	uploadFileToS3,
	deleteFileFromS3,
	generatePresignedUrl,
} from "./s3Utils.js";
import { useNavigate } from "react-router-dom";
import { formatBytes, formatDate } from "../Utils.js";

export default function Dashboard() {

	const isUserLoggedIn = !!localStorage.getItem('token')
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('token')
		navigate('/login');
	}

	const [files, setFiles] = useState([]);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		const fetchS3Objects = async () => {
			try {
				const data = await listS3Objects("fylesstorage");
				setFiles(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchS3Objects();
	}, []);

	const handleUpload = async (event) => {
		const file = event.target.files[0];
		if (file) {
			try {
				setUploading(true);
				await uploadFileToS3("fylesstorage", file);
				const data = await listS3Objects("fylesstorage");
				setFiles(data);
			} catch (error) {
				console.error("Upload error:", error);
			} finally {
				setUploading(false);
			}
		} else {
			console.error("No file selected for upload.");
		}
	};

	const handleDelete = async (fileName) => {
		if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
			try {
				await deleteFileFromS3("fylesstorage", fileName);
				const data = await listS3Objects("fylesstorage");
				setFiles(data);
			} catch (error) {
				console.error("Delete error:", error);
			}
		}
	};

	const handleDownload = async (fileName) => {
		try {
			const presignedUrl = await generatePresignedUrl("fylesstorage", fileName);
			window.location.href = presignedUrl;
		} catch (error) {
			console.error("Error generating pre-signed URL:", error);
		}
	};

	const handleUrl = async (fileName) => {
		try {
			const presignedUrl = await generatePresignedUrl("fylesstorage", fileName);

			const tempInput = document.createElement("input");

			tempInput.value = presignedUrl;

			document.body.appendChild(tempInput);

			tempInput.select();

			document.body.removeChild(tempInput);

			console.log("URL copied to clipboard:", presignedUrl);
		} catch (error) {
			console.error("Error generating pre-signed URL:", error);
		}
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

					<button className="pl-3"
					onClick={handleLogout}>
						<svg className="w-5 h-5 text-black "xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 15"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 7.5h11m0 0L8 3.786M12 7.5l-4 3.714M12 1h3c.53 0 1.04.196 1.414.544.375.348.586.82.586 1.313v9.286c0 .492-.21.965-.586 1.313A2.081 2.081 0 0 1 15 14h-3"/> </svg>
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
						</tr>
					</thead>
					<tbody className="text-gray-600 divide-y">
						{files.map((file, index) => (
							<tr key={index}>
								<td className="pr-6 py-4 whitespace-nowrap">{file.Key}</td>
								<td className="pr-6 py-4 whitespace-nowrap">
									{formatDate(file.LastModified)}
								</td>
								<td className="pr-6 py-4 whitespace-nowrap">{"Vain"}</td>
								<td className="pr-6 py-4 whitespace-nowrap">
									{formatBytes(file.Size)}
								</td>
								<td className="whitespace-nowrap">
									<img
										src={DownloadIcon}
										alt=""
										onClick={() => handleDownload(file.Key)}
										className="cursor-pointer h-5 hover:scale-125 transition-all"
									/>
								</td>
								<td className="whitespace-nowrap">
									<img
										src={DeleteIcon}
										alt=""
										onClick={() => handleDelete(file.Key)}
										className="cursor-pointer h-5 hover:scale-125 transition-all"
									/>
								</td>
								<td className="whitespace-nowrap">
									<img
										src={LinkIcon}
										onClick={() => handleUrl(file.Key)}
										alt=""
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
