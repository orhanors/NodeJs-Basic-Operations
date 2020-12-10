const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const Joi = require("joi");
const { sign } = require("crypto");
const { POINT_CONVERSION_UNCOMPRESSED } = require("constants");
const router = express.Router();
// {
//     "id:": "",
//     "name": "Orhan",
//     "surname": "Örs",
//     "email": "",
//     "dateOfBirth": ""
// }

const validateInput = (dataToValidate) => {
	const schema = Joi.object().keys({
		name: Joi.string().min(3).max(30).required(),
		surname: Joi.string().min(3).max(30).required(),
		email: Joi.string().email().required(),
		birthDate: Joi.date().iso(),
	});

	console.log(schema.validate(dataToValidate));
	return schema.validate(dataToValidate);
};

const getStudents = () => {
	const filePath = path.join(__dirname, "students.json");
	const buffer = fs.readFileSync(filePath);

	return JSON.parse(buffer.toString());
};

const addStudentsToFile = (students) => {
	const filePath = path.join(__dirname, "students.json");
	fs.writeFileSync(filePath, JSON.stringify(students));
};
router.get("/", (req, res) => {
	const students = getStudents();
	res.send(students);
});

router.get("/:id", (req, res) => {
	const students = getStudents();
	const student = students.find((s) => s.id === req.params.id);
	res.send(student);
});

router.post("/", (req, res) => {
	const students = getStudents();

	const sameEmail = students.filter((s) => s.email === req.body.email);
	const { error } = validateInput(req.body);

	if (error) {
		res.status(400).send(error.details[0].message);
	} else if (sameEmail.length > 0) {
		res.status(400).send("This e-mail is alredy exist");
	} else {
		const newUser = req.body;

		newUser.id = uniqid();

		students.push(newUser);

		addStudentsToFile(students);
		res.send(newUser);
	}
});

router.put("/:id", (req, res) => {
	const students = getStudents();

	const { error } = validateInput(req.body);

	if (error) {
		res.status(400).send(error.details[0].message);
	} else {
		const filteredStudents = students.filter((s) => s.id !== req.params.id);

		const modifiedUser = req.body;
		modifiedUser.id = req.params.id;

		filteredStudents.push(modifiedUser);

		addStudentsToFile(filteredStudents);
		res.send(modifiedUser);
	}
});

router.delete("/:id", (req, res) => {
	const students = getStudents();

	const student = students.find((s) => s.id === req.params.id);

	if (!student) {
		req.status(404).send("The student not found with given id");
	} else {
		const newStudents = students.filter((s) => s.id !== req.params.id);
		addStudentsToFile(newStudents);

		res.status(200).send(student);
	}
});

module.exports = router;
