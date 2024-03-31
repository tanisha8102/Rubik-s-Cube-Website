const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');
const moment = require('moment'); // Import the moment library for timestamp handling

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Route to render index.html for the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to render signup.html for the "/signup" route
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Route to render login.html for the "/login" route
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/thankyou", (req, res) => {
    res.sendFile(path.join(__dirname, 'thankyou.html'));
});

// Route to handle user registration
app.post("/signup", async(req, res) => {
    const { userid, username, email, password } = req.body;

    try {
        // Check if the username already exists in the database
        const existingUser = await collection.findOne({ name: username });

        if (existingUser) {
            return res.send('User already exists. Please choose a different username.');
        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Record signup time
        const signupTime = new Date(); // Get current timestamp
        const newUser = await collection.create({
            name: username,
            userid: userid,
            email: email,
            password: hashedPassword,
            signupTime: signupTime // Record signup time in the database
        });
        console.log('User registered successfully.');

        // Redirect the user to cube.html after successful registration
        res.redirect('/login');
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('An error occurred while registering the user.');
    }
});

// Route to handle user login
// Route to handle user login
app.post("/login", async(req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user in the database by username
        const user = await collection.findOne({ name: username });

        if (!user) {
            return res.send("User not found.");
        }

        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.send("Wrong password.");
        }

        // Record login time in the database
        const loginTime = new Date(); // Get current timestamp
        await collection.updateOne({ name: username }, { $set: { loginTime: loginTime } });

        // Redirect to cube.html upon successful login
        res.redirect("/cube.html");
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while logging in.');
    }
});



// Route to handle user logout
// Route to handle user logout
app.post("/logout", async(req, res) => {
    const { username } = req.body;

    try {
        // Record logout time in the database
        const logoutTime = new Date(); // Get current timestamp
        const updateResult = await collection.updateOne({ name: username }, { $set: { logoutTime: logoutTime } });


        if (updateResult.modifiedCount === 1) {
            console.log('Logout time recorded successfully:', logoutTime);
            res.redirect("/login");
        } else {
            console.log('No user document updated.');
            res.status(404).send('User not found or logout time not updated.');
        }
    } catch (error) {
        console.error('Error updating logout time:', error);
        res.status(500).send('An error occurred while logging out.');
    }
});


// Route to handle GET request for "/cube.html"
app.get("/cube.html", (req, res) => {
    res.sendFile(path.join(__dirname, 'cube.html'));
});

// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});