const express = require("express");
const cors = require("cors");
const studentsRouter = require("./students");
const projectsRouter = require("./projects");
const {
	notFoundHandler,
	unauthorizedHandler,
	forbiddenHandler,
	catchAllHandler,
} = require("./errorHandling");

const server = express();
const port = process.env.PORT || 3000;

server.use(cors());
server.use(express.json());

server.use("/students", studentsRouter);
server.use("/projects", projectsRouter);

server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllHandler);

server.listen(port, () => {
	console.log("Server is running on port: ", port);
});
