const mongoose = require('mongoose');
const { collection } = require('./bookingSchema');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Who is the user?']
    },
    password: {
        type: String,
        required: [true, 'What is the password?']
    }
}, {collection: 'users'})

const Users = mongoose.model('user', UserSchema);
module.exports = Users;