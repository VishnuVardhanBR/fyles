import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/userSchema.js";
import dotenv from "dotenv";
dotenv.config();
import expressfileupload from "express-fileupload";

import authenticateToken from "./authenticateToken.js";

const app = express();
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const dbURI = process.env.DB_URI;

mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(3001, () => {
			console.log("Server is connected to port 3001 and connected to MongoDB");
		});
	})
	.catch((error) => {
		console.log("Unable to connect to Server and MongoDB: " + error);
	});

app.use(bodyParser.json());
app.use(cors());
app.use(expressfileupload());

app.post("/register", async (req, res) => {
	try {
		const { username, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({ username: username, password: hashedPassword });
		await newUser.save();
		res.status(201).json({ message: "User created" });
	} catch (error) {
		res.status(500).json({ error: "Error in sign up" + error });
	}
});

//REGISTER USER



app.post("/register", async (req, res) => {
	try {
		const { username, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({ username: username, password: hashedPassword });
		await newUser.save();
		res.status(201).json({ message: "User created" });
	} catch (error) {
		res.status(500).json({ error: "Error in sign up" + error });
	}
});

//GET LOGIN
app.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json({ error: "Invalid Credentials" });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid Credentials" });
		}

		const token = jwt.sign(
			{ userId: user._id, username: username },
			SECRET_KEY,
			{
				expiresIn: "1d",
			}
		);
		// console.log(token)
		console.log(username + " Login succesful");
		res.json({ message: "Login Successful", token: token });
	} catch (error) {
		res.status(500).json({ error: "Error logging in" + error });
	}
});

import {
	listS3Objects,
	uploadFileToS3,
	generatePresignedUrl,
	deleteFileFromS3,
} from "./s3Utils.js";

function getUsername(token) {
	const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
	const username = decodedToken.username;
	return username;
}

//LIST S3 OBJECTS
app.get("/listobjects", authenticateToken, async (req, res) => {
	try {
		const token = req.headers.authorization;
		const username = getUsername(token);
		const allObjects = await listS3Objects(username);
		// const userObjects = allObjects.filter(object => object.Key.startsWith(username));
		res.status(200).json(allObjects);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Error listing objects" + err });
	}
});

//GENERATE PRESIGNED URL
app.post("/generatepresignedurl", authenticateToken, async (req, res) => {
	try {
		const token = req.headers.authorization;
		const username = getUsername(token);
		const url = await generatePresignedUrl(username + "/" + req.body.filename);
		res.status(200).json({ url: url });
	} catch (err) {
		res.status(500).json({ error: "Error generating presigned url" });
	}
});

//DELETE FILE FROM S3
app.post("/deleteobject", authenticateToken, async (req, res) => {
	try {
		const token = req.headers.authorization;
		const username = getUsername(token);
		await deleteFileFromS3(username + "/" + req.body.filename);
		res.status(200).json({ message: "Object deleted" });
	} catch (err) {
		res.status(500).json({ error: "Error deleting object" + err });
	}
});

//UPLOAD FILE TO S3
app.post("/uploadobject", authenticateToken, async (req, res) => {
	try {
		const token = req.headers.authorization;
		const username = getUsername(token);
		req.files.file.name = username + "/" + req.files.file.name;
		await uploadFileToS3(req.files.file);
		res.status(200).json({ message: "Object uploaded" });
	} catch (err) {
		res.status(500).json({ error: "Error uploading object" + err });
	}
});
module.exports = app;
