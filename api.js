'use strict';

require('dotenv').config();

// ############################################# //
// ##### Server Setup for Users Management API ##### //
// ############################################# //

// Importing packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Enable CORS for all routes
// This allows the frontend to communicate with the backend without CORS issues
app.use(cors());

// Initialize Express app
const app = express();
// Define the port for the server to listen on
const port = process.env.PORT || 3000; // You can change this port

// Middleware setup
app.use(cors());
app.use(express.json());

// MongoDB connection string
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log('Users API Server is running on port ' + port);
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// ############################################# //
// ##### Users Model Setup ##### //
// ############################################# //
const Schema = mongoose.Schema;

// Define the schema for the Users model
const usersSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    email: { type: String, required: true },
    username: { type: String, required: true }
});

// Create the Mongoose model
const Users = mongoose.model('Users', usersSchema);

// ############################################# //
// ##### Users API Routes Setup ##### //
// ############################################# //
const router = express.Router();

// Mount the router to the '/api/users' endpoint
app.use('/api/users', router);

// Route to get all users
router.route("/")
    .get((req, res) => {
        Users.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(400).json({ error: "Error: " + err.message }));
    })

// Route to get a random user
router.route("/random")
    .get((req, res) => {
        Users.countDocuments()
            .then((count) => {
                if (count === 0) {
                    return res.status(404).json({ error: "No users found" });
                }

                const random = Math.floor(Math.random() * count);

                Users.findOne().skip(random)
                    .then((randomUser) => {
                        res.json(randomUser);
                    })
                    .catch((err) => res.status(400).json({ error: "Error fetching random user: " + err.message }));
            })
            .catch((err) => res.status(400).json({ error: "Error counting users: " + err.message }));
    });
// Route to get a specific user by id
router.route("/:id")
    .get((req, res) => {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid id, must be a number" });
        }

        Users.findOne({ id: userId })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }
                res.json(user);
            })
            .catch((err) => res.status(400).json({ error: "Error: " + err.message }));
    });

// Route to add a new user
// Route to get a specific user by id
router.route("/:id")
    .get((req, res) => {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid id, must be a number" });
        }

        Users.findOne({ id: userId })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }
                res.json(user);
            })
            .catch((err) => res.status(400).json({ error: "Error: " + err.message }));
    });

// Route to add a new user
router.route("/add").post(async (req, res) => {
    const { id, email, username } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: "id must be a valid number" });
    }

    try {
        // Check if ID already exists
        const existingUser = await Users.findOne({ id });

        if (existingUser) {
            return res.status(409).json({ error: "A user with this ID already exists" });
        }

        const newUser = new Users({ id, email, username });
        await newUser.save();

        res.json("User added!");
    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

// Route to update an existing user
router.route("/update/:id")
    .put((req, res) => {
        const { email, username } = req.body;
        const userId = parseInt(req.params.id);
        
        // Check if the id is a valid number
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid id, must be a number" });
        }

        Users.findOne({ id: userId })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }

                user.email = email;
                user.username = username;

                user.save()
                    .then(() => res.json("User updated!"))
                    .catch((err) => res.status(400).json({ error: "Error: " + err.message }));
            })
            .catch((err) => res.status(400).json({ error: "Error: " + err.message }));
    });

// Route to delete a user by id
router.route("/delete/:id")
    .delete((req, res) => {
        const userId = parseInt(req.params.id);

        // Check if the id is a valid number
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid id, must be a number" });
        }

        Users.findOneAndDelete({ id: userId })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }
                res.json("User deleted.");
            })
            .catch((err) => res.status(400).json({ error: "Error: " + err.message }));
    });

    // Route to get one random user



