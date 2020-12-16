const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
	firstName: { type: String, minlength: 2, maxlength: 30, required: true },
	lastName: { type: String, minlength: 2, maxlength: 30, required: true },
	email: { type: String, minlength: 5, maxlength: 50, required: true },
	timeOfArrival: { type: String },
});

const Attendee = mongoose.model("attendee", attendeeSchema, "attendees");

module.exports = Attendee;
