const express = require("express");
const multer = require("multer");

const { readDB, writeDB } = require("../../../lib/fileProcess");
const { writeFile, createReadStream } = require("fs-extra");
const { join } = require("path");
const router = express.Router();

const upload = multer({});

const projectFilesPath = join(__dirname, "../../../public/img/projects");

const projectsJsonPath = join(__dirname, "../../projects/projects.json");

router.post(
	"/:id/uploadPhoto",
	upload.single("project"),
	async (req, res, next) => {
		try {
			const imageFormat = "." + req.file.originalname.split(".").pop();
			const imagePath = join(
				projectFilesPath,
				req.params.id + imageFormat
			);
			await writeFile(imagePath, req.file.buffer);

			let projects = await readDB(projectsJsonPath);
			console.log("projects", projects);
			let project = projects.find((s) => s.id == req.params.id);

			project.image = imagePath;

			projects = projects.filter((s) => s.id !== req.params.id);

			projects.push(project);

			await writeDB(projectsJsonPath, projects);
			res.send("ok");
		} catch (err) {
			console.log(err);
			next(err);
		}
	}
);
module.exports = router;
