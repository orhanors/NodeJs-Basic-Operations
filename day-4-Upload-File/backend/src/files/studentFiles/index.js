const express = require("express");
const multer = require("multer");

const { readDB, writeDB } = require("../../../lib/fileProcess");
const { writeFile, createReadStream } = require("fs-extra");
const { join } = require("path");
const router = express.Router();

const upload = multer({});

const studentFilesPath = join(__dirname, "../../../public/img/students");

const studentsJsonPath = join(__dirname, "../../students/students.json");

router.post(
	"/:id/uploadPhoto",
	upload.single("profile"),
	async (req, res, next) => {
		try {
			const imageFormat = "." + req.file.originalname.split(".").pop();
			const imagePath = join(
				studentFilesPath,
				req.params.id + imageFormat
			);
			await writeFile(imagePath, req.file.buffer);

			let students = await readDB(studentsJsonPath);
			const student = students.find((s) => s.id == req.params.id);

			student.image = imagePath;

			students = students.filter((s) => s.id !== req.params.id);

			students.push(student);

			await writeDB(studentsJsonPath, students);
			res.send("ok");
		} catch (err) {
			console.log(err);
			next(err);
		}
	}
);
module.exports = router;
