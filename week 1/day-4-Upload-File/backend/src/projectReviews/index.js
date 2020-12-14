const express = require("express");
const { readDB, writeDB } = require("../../lib/fileProcess");
const { join } = require("path");
const uniqid = require("uniqid");
const Joi = require("joi");
const router = express.Router();

const reviewsJsonFilePath = join(__dirname, "reviews.json");

const projectsJsonFilePath = join(__dirname, "../projects/projects.json");
const validateInput = (dataToValidate) => {
	const schema = Joi.object().keys({
		name: Joi.string().min(3).max(30).required(),
		text: Joi.string().min(3).max(150).required(),
		projectId: Joi.string().required(),
	});

	console.log(schema.validate(dataToValidate));
	return schema.validate(dataToValidate);
};

router.get("/:id/reviews", async (req, res, next) => {
	try {
		const allReviews = await readDB(reviewsJsonFilePath);

		const projectReviews = allReviews.filter(
			(project) => project.projectId === req.params.id
		);

		if (projectReviews.length === 0) {
			const error = new Error();
			error.httpStatusCode = 404;
			next(error);
		} else {
			res.send(projectReviews);
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
});

router.post("/:id/reviews", async (req, res, next) => {
	try {
		const { error } = validateInput(req.body);

		if (error) {
			const err = new Error();
			err.httpStatusCode = 400;
			err.message = error.details[0].message;
			next(err);
		} else {
			const newReview = {
				...req.body,
				id: uniqid(),
				createdAt: new Date(),
			};

			const allReviews = await readDB(reviewsJsonFilePath);
			allReviews.push(newReview);

			let allProjects = await readDB(projectsJsonFilePath);
			let project = allProjects.find((p) => p.id === req.params.id);

			allProjects = allProjects.filter((p) => p.id !== req.params.id);

			if (project.review) {
				project.review.push(newReview);
			} else {
				project.review = [];
				project.review.push(newReview);
			}
			allProjects.push(project);

			await writeDB(reviewsJsonFilePath, allReviews);

			await writeDB(projectsJsonFilePath, allProjects);
			res.send(newReview);
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
});
module.exports = router;
