const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'What is the date for the booking?']
    },
    startTime:  [String]
        /*{
        type: Array,
        required: [true, 'What is the start time [hh, mm] for the boooking?']
    }*/,
    endTime: [String]/*{
        type: Array,
        required: [true, 'What is the end time [hh, mm] for the boooking?']
    }*/,
    user: {
        type: String,
        required: [true, 'Who made the booking?']
    },
    message:{
        type: String
    }
}, {collection: 'bookings'})

const Booking = mongoose.model('booking', BookingSchema);
module.exports = Booking;