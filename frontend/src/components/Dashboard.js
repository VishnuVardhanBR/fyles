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
import { formatBytes, formatDate } from "../Utils.js";

export default function Dashboard() {
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

			document.execCommand("copy");

			document.body.removeChild(tempInput);

			console.log("URL copied to clipboard:", presignedUrl);
		} catch (error) {
			console.error("Error generating pre-signed URL:", error);
		}
	};

	return (
		<div className="mt-5 max-w-screen-xl mx-auto px-4 md:px-8">
			<div className="items-start justify-between md:flex">
				<div className="flex items-center">
					<img src={LogoImage} alt="Logo" className="h-8 mr-2" />{" "}
					<h4
						href="/"
						className="cursor-pointer text-gray-800 text-2xl font-bold hover:scale-125 transition-all"
					>
						fyles.
					</h4>
				</div>
				<div className="mt-3 md:mt-0">
					<label
						htmlFor="file-input"
						className={`cursor-pointer inline-block px-4 py-2 text-black duration-150 font-medium bg-gray-300 rounded-lg ${
							uploading ? "animate-pulse" : "hover:drop-shadow-2xl"
						} md:text-sm`}
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
