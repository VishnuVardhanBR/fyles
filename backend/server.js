const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('./models/userSchema')
const app = express();
require('dotenv').config()

const SECRET_KEY = process.env.JWT_SECRET_KEY
console.log(SECRET_KEY)
const dbURI = "mongodb://127.0.0.1:27017/test";

mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(3001, () => {
			console.log("Server is connected to port 3001 and connected to MongoDB");
		});
	})
	.catch((error) => {
		console.log("Unable to connect to Server and MongoDB: "+error);
	});

app.use(bodyParser.json());
app.use(cors());

//REGISTER USER
app.post('/register', async (req, res)=>{
    try {
        const {username, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({username: username, password : hashedPassword})
        await newUser.save()
        res.status(201).json({message: 'User created'})
    }
    catch (error){
        res.status(500).json({error: 'Error in sign up'+ error})
    }
})

//GET REGISTERED USERS
app.get('/register', async(req, res) => {
    try{
        const users = await User.find();
        res.status(201).json(users)
    }
    catch{
        res.status(500).json({error: "Unable to get users"})
    }
})


//GET LOGIN
app.post('/login', async(req, res)=>{
    try{
        const {username, password} = req.body
        const user = await User.findOne({username})
        if(!user){
            return res.status(401).json({error: "Invalid Credentials"})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.status(401).json({error: "Invalid Credentials"})
        }
        const token = jwt.sign({userId: user._id}, SECRET_KEY, {expiresIn: '1d'})
        res.json({message: 'Login Successful'})
    }
    catch (error){
        res.status(500).json({error: "Error logging in"})
    }
})
