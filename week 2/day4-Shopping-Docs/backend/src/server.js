const cors = require("cors");
const express = require("express");
const listEndpoints = require("express-list-endpoints");
const products = require("./services/products");
const carts = require("./services/shoppingCart");
const { join } = require("path");
const swaggerUI = require("swagger-ui-express");
const yaml = require("yamljs");
const {
	badRequestHandler,
	notFoundHandler,
	unauthorizedHandler,
	forbiddenHandler,
	catchAllHandler,
} = require("./errorHandling");

const hostname = "localhost";
const port = process.env.PORT || 3001;
const publicImageFile = join(__dirname, "../public/img/products");

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.static(publicImageFile));

const swaggerDoc = yaml.load(join(__dirname, "../openapi.yaml"));

server.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
server.use("/products", products);
server.use("/carts", carts);

//ERROR MIDDLEWARE GOES HERE
// ERROR MIDDLEWARE MUST HAPPEN LAST
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllHandler);

console.log(listEndpoints(server));

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
