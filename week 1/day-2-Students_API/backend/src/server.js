const express = require("express");
const cors = require("cors");
const studentsRouter = require("./students");

const server = express();
const port = process.env.PORT || 3000;

server.use(cors());
server.use(express.json());

server.use("/students", studentsRouter);

server.listen(port, () => {
	console.log("Server is running on port: ", port);
});
