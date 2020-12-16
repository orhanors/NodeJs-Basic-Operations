const express = require("express");
const Attendee = require("../../models/attendeeModel"); //Attendee db model
const Joi = require("joi");
const sgMail = require("@sendgrid/mail");
const { createReadStream } = require("fs-extra");
const { join } = require("path");
const { Transform } = require("json2csv");
const exploreFolders = require("./exploreFolders");
const { pipeline } = require("stream");

const filesRouter = express.Router();

const validateAttendee = (dataToValidate) => {
	const schema = Joi.object().keys({
		firstName: Joi.string().min(3).max(30).required(),
		lastName: Joi.string().min(3).max(30).required(),
		email: Joi.string().email().required(),
		timeOfArrival: Joi.string().min(4).max(30).required(),
	});

	console.log(schema.validate(dataToValidate));
	return schema.validate(dataToValidate);
};
const sendEmail = async (toEmail) => {
	try {
		console.log("stuffs working....");
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);

		const msg = {
			to: toEmail,
			from: "orsorhan1@gmail.com",
			subject: "Strive sendgrid e-mail",
			text:
				"We are inviting you to joining Strive School.Why? We dont know.Just join",
			html: "<strong>Perfect place to learning coding</strong>",
		};

		const result = await sgMail.send(msg);
		console.log("sendgrid result is ", result);
	} catch (error) {
		console.log("Email error is", error);
	}
};
filesRouter.post("/", async (req, res, next) => {
	console.log("possssttt");
	try {
		const { error } = validateAttendee(req.body);
		const email = await Attendee.find({ email: req.body.email }); //it returns an array

		if (error) {
			const err = new Error();
			err.httpStatusCode = 400;
			err.message = error.details[0].message;
			next(err);
		} else if (email.length > 0) {
			const err = new Error();
			err.httpStatusCode = 400;
			err.message = "ERROR! User email is already exist";
			next(err);
		} else {
			const newAttendee = new Attendee({
				...req.body,
			});

			try {
				const result = await newAttendee.save();
				console.log("post result is here: ", result);
				//await sendEmail(req.body.email);
				res.status(201).send(newAttendee);
			} catch (error) {
				console.log(error);
				next(error);
			}
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});
filesRouter.get("/csv", async (req, res, next) => {
	try {
		const allAttendees = await Attendee.find({});

		const json2csv = new Transform({
			fields: ["_id", "firstName", "lastName", "email", "timeOfArrival"],
		});

		res.setHeader(
			"Content-Disposition",
			"attachment; filename=attendees.csv"
		);
		//NOTE Dont forget the JSON.stringify for database object
		pipeline(JSON.stringify(allAttendees), json2csv, res, (err) => {
			if (err) {
				console.log(err);
				next(err);
			} else {
				console.log("Done");
			}
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
});

filesRouter.post("/:id/createPDF", async (req, res, next) => {
	try {
		const attendee = await Attendee.find({ _id: req.params.id });

		const publicFolderPath = join(__dirname, "../../../public/pdf");
		const response = await exploreFolders(publicFolderPath);
		res.send(response);
	} catch (error) {
		console.log(error);
		next(error);
	}
});
module.exports = filesRouter;
