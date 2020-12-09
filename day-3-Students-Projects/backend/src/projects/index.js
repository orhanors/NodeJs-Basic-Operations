const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");
const Joi = require("joi");
const router = express.Router();

/**
 *  - Name
    - Description
    - Creation Date
    - ID
    - RepoURL -> Code Repo URL (es.: GitHub / BitBucket project URL)
    - LiveURL -> URL of the "live" project
    - StudentID
 */
const validateInput = (dataToValidate) => {
	const schema = Joi.object().keys({
		name: Joi.string().min(3).max(30).required(),
		description: Joi.string().min(3).max(100).required(),
		repoUrl: Joi.string().required(),
		liveUrl: Joi.string().required(),
		studentId: Joi.string().required(),
	});

	console.log(schema.validate(dataToValidate));
	return schema.validate(dataToValidate);
};

const getProjects = (fileName) => {
	const filePath = path.join(__dirname, fileName);
	const buffer = fs.readFileSync(filePath);
	return JSON.parse(buffer.toString());
};

const addNewProjectToFile = (data) => {
	fs.writeFileSync(
		path.join(__dirname, "projects.json"),
		JSON.stringify(data)
	);
};

router.get("/", (req, res, next) => {
	try {
		const projects = getProjects("projects.json");

		if (req.query && req.query.name) {
			const filteredProjects = projects.filter(
				(project) =>
					project.hasOwnProperty("name") &&
					project.name
						.toLowerCase()
						.contains(req.query.name.toLowerCase())
			);
			res.send(filteredProjects);
		} else {
			res.send(projects);
		}
	} catch (error) {
		next(error);
	}
});

router.get("/:id", (req, res, next) => {
	try {
		const projects = getProjects("projects.json");

		const project = projects.find((p) => p.id === req.params.id);

		const studentProjects = projects.filter(
			(p) => p.studentId === req.params.id
		);

		if (project) {
			res.send(project);
		} else if (studentProjects.length > 0) {
			res.send(studentProjects);
		} else {
			const err = new Error();
			err.httpStatusCode = 404;
			next(err);
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
});

router.post("/", (req, res, next) => {
	try {
		const { error } = validateInput(req.body);

		if (error) {
			res.send(400).send(error.details[0].message);
		} else {
			const projects = getProjects("projects.json");

			const newProject = {
				...req.body,
				createdAt: new Date(),
			};
			newProject.id = uniqid();
			projects.push(newProject);

			addNewProjectToFile(projects);

			res.send(newProject);
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
});

router.put("/:id", (req, res, next) => {
	try {
		const projects = getProjects("projects.json");

		const { error } = validateInput(req.body);
		if (error) {
			res.status(400).send(error.details[0].message);
		} else {
			const newProjects = projects.filter((p) => p.id !== req.params.id);

			const editedProject = {
				...req.body,
				id: req.params.id,
				createdAt: new Date(),
			};

			newProjects.push(editedProject);
			addNewProjectToFile(newProjects);
			res.send(editedProject);
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
});

router.delete("/:id", (req, res, next) => {
	try {
		const projects = getProjects("projects.json");
		const filteredProjects = projects.filter((p) => p.id !== req.params.id);

		if (projects.length === filteredProjects.length) {
			const error = new Error();
			error.httpStatusCode = 404;
			next(error);
		} else {
			addNewProjectToFile(filteredProjects);
			res.status(200).send(req.body);
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
});
module.exports = router;
