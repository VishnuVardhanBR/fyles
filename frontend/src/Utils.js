
export function formatBytes(bytes) {
	let x = parseInt(bytes);
	const units = ["B", "KB", "MB", "GB", "TB"];
	let i = 0;
	while (x >= 1024 && i < units.length - 1) {
		x /= 1024;
		i++;
	}
	return x.toFixed(2) + " " + units[i];
}

export function formatDate(inputDate) {
	const date = new Date(inputDate);
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const day = date.getDate();
	const monthIndex = date.getMonth();
	const year = date.getFullYear();

	const formattedDate = `${day} ${months[monthIndex]} ${year}`;
	return formattedDate;
}
