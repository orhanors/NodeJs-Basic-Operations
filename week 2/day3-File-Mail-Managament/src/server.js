const express = require("express");
const {
	notFoundError,
	forbiddenError,
	genericError,
	badRequestError,
	unauthorizedError,
} = require("./errorHandling");
const cors = require("cors");
const { join } = require("path");
const listEndpoints = require("express-list-endpoints");
const mongoose = require("mongoose");
const filesRouter = require("./services/files");
const port = process.env.PORT || 3001;
const mongo_uri = process.env.MONGODB_LOCAL_DB;
const server = express();

const publicPdf = join(__dirname, "../public/pdf");
mongoose
	.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connected to local database"))
	.catch((err) => console.log("ERROR! ", err.message));
//MIDDLEWARES
server.use(cors());
server.use(express.json());

//ROUTES
server.use("/attendees", filesRouter);
server.use(express.static(publicPdf));
//ERROR MIDDLEWARES
// NOTE dont forget to keep generic error last.Because it doesnt return next route
server.use(notFoundError);
server.use(forbiddenError);
server.use(badRequestError);
server.use(unauthorizedError);
server.use(genericError);

if (server.get("env") !== "production") console.log(listEndpoints(server));
server.listen(port, () => {
	if (server.get("env") === "production") {
		console.log("Server is running on CLOUD on port:", port);
	} else {
		console.log("Server is running LOCALLY on port:", port);
	}
});
