const express = require("express");
const { join } = require("path");
const cors = require("cors");
const studentsRouter = require("./students");
const projectsRouter = require("./projects");
const projectReviewsRouter = require("./projectReviews");
const studentFilesRouter = require("./files/studentFiles");
const projectFilesRouter = require("./files/projectFiles");
const listendpoints = require("express-list-endpoints");
const publicFolderPath = join(__dirname, "../public");
const {
	notFoundHandler,
	unauthorizedHandler,
	forbiddenHandler,
	catchAllHandler,
	badRequest,
} = require("./errorHandling");

const server = express();
const port = process.env.PORT || 3000;

// MIDDLEWARES
server.use(cors());
server.use(express.json());
server.use(express.static(publicFolderPath));

//ROUTERS
server.use("/students", studentsRouter);
server.use("/students", studentFilesRouter);

server.use("/projects", projectsRouter);
server.use("/projects", projectFilesRouter);
server.use("/projects", projectReviewsRouter);

//console.log(listendpoints(server));
// ERRORS
server.use(notFoundHandler);
server.use(badRequest);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllHandler);

server.listen(port, () => {
	console.log("Server is running on port: ", port);
});
