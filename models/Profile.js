const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
    type: {
        type: String
    },
    describe: {
        type: String
    },
    carat: {
        type: String,
        required: true
    },
    Perton: {
        type: String,
        required: true
    },
    intotal: {
        type: String,
        required: true
    },
    remak: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);