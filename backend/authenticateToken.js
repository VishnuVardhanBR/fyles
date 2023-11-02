import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export default function authenticateToken(req, res, next) {
	const token = req.headers.authorization;
	if (!token) {
		return res.status(401).json({ error: "Access Denied" });
	}

	jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
		if (err) return res.status(403).json({ error: "Invalid Token" });

		req.user = user;
		next();
	});
}
