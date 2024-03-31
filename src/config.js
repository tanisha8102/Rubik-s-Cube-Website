const mongoose = require('mongoose');

// Connect to MongoDB with increased timeout
mongoose.connect('mongodb://localhost:27017/Login-tut', {
        bufferCommands: false, // Disable command buffering
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });

// Create Schema
const Loginschema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    loginTime: {
        type: Date,
        default: null // Default value is null until user logs in
    },
    logoutTime: {
        type: Date,
        default: null // Default value is null until user logs out
    }
});

// collection part
const collection = mongoose.model("users", Loginschema);

module.exports = collection;