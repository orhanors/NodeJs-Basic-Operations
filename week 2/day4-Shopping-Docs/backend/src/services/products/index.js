const express = require("express");
const fs = require("fs"); //import to read and write file
const path = require("path"); //for relative pathing to json file
const uniqid = require("uniqid"); //for generating unique id for each student
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const { parseString } = require("xml2js");
const publicIp = require("public-ip");
const axios = require("axios");
const { promisify } = require("util");
const { begin } = require("xmlbuilder");
const { readDB, writeDB } = require("../../lib/utilities");
const { writeFile } = require("fs-extra");
const upload = multer({});

const productsPublicFile = path.join(__dirname, "../../../public/img/products");

const productsFilePath = path.join(__dirname, "products.json");
const reviewsFilePath = path.join(__dirname, "reviews.json");

/**
 * 
 *  {
        "_id": "5d318e1a8541744830bef139", //SERVER GENERATED
        "name": "app test 1",  //REQUIRED
        "description": "somthing longer", //REQUIRED
        "brand": "nokia", //REQUIRED
        "imageUrl": "https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80",
        "price": 100, //REQUIRED
        "category": "smartphones"
        "createdAt": "2019-07-19T09:32:10.535Z", //SERVER GENERATED
        "updatedAt": "2019-07-19T09:32:10.535Z", //SERVER GENERATED
    }
 
 */
const validateProductInput = (dataToValidate) => {
	const schema = Joi.object().keys({
		name: Joi.string().min(3).max(30).required(),
		description: Joi.string().min(3).max(200).required(),
		brand: Joi.string().min(3).required(),
		price: Joi.number().required(),
		category: Joi.string().min(2),
	});

	console.log(schema.validate(dataToValidate));
	return schema.validate(dataToValidate); //error,value
};
/**
 *   {
        "_id": "123455", //SERVER GENERATED
        "comment": "A good book but definitely I don't like many parts of the plot", //REQUIRED
        "rate": 3, //REQUIRED, max 5
        "elementId": "5d318e1a8541744830bef139", //REQUIRED
        "createdAt": "2019-08-01T12:46:45.895Z" // SERVER GENERATED
    },
 */

const validateReviewInput = (dataToValidate) => {
	const schema = Joi.object().keys({
		comment: Joi.string().min(3).max(200).required(),
		rate: Joi.number().min(1).max(5).required(),
		elementId: Joi.string().required(),
	});

	console.log(schema.validate(dataToValidate));
	return schema.validate(dataToValidate); //error,value
};

// "/" GET ALL PRODUCTS
router.get("/", async (req, res, next) => {
	try {
		const allProducts = await readDB(productsFilePath);
		if (req.query && req.query.category) {
			const filteredData = allProducts.filter(
				(product) =>
					product.hasOwnProperty("category") &&
					product.category
						.toLowerCase()
						.includes(req.query.category.toLowerCase())
			);
			res.send(filteredData);
		}
		res.send(allProducts);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// "/" POST A PRODUCT
router.post("/", async (req, res, next) => {
	try {
		const { error } = validateProductInput(req.body);

		if (error) {
			let err = new Error();
			err.message = error.details[0].message;
			err.httpStatusCode = 400;
			next(err);
		} else {
			let newProduct = {
				...req.body,
				_id: uniqid(),
				createdAt: new Date(),
			};

			const allProducts = await readDB(productsFilePath);
			allProducts.push(newProduct);

			await writeDB(productsFilePath, allProducts);
			res.status(200).send(newProduct);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// "/:id" GET A SINGLE PRODUCT
router.get("/:id", async (req, res, next) => {
	try {
		const allProducts = await readDB(productsFilePath);
		let product = allProducts.find((p) => p._id === req.params.id);
		if (!product) {
			const err = new Error();
			err.htttpStatusCode = 404;
			next(err);
		} else {
			res.status(200).send(product);
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
});

// "/:id" UPDATE A PRODUCT
router.put("/:id", async (req, res, next) => {
	try {
		const { error } = validateProductInput(req.body);
		const allProducts = await readDB(productsFilePath);
		const newProducts = allProducts.filter(
			(product) => product._id !== req.params.id
		);
		const modifiedProduct = req.body;
		modifiedProduct._id = req.params.id;
		modifiedProduct.updatedAt = new Date();
		if (error) {
			let err = new Error();
			err.message = error.details[0].message;
			err.httpStatusCode = 400;
			next(err);
		} else {
			newProducts.push(modifiedProduct);
			await writeDB(productsFilePath, newProducts);
			res.status(200).send(modifiedProduct);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// "/:id" REMOVE A PRODUCT
router.delete("/:id", async (req, res, next) => {
	try {
		const allProducts = await readDB(productsFilePath);
		const newProducts = allProducts.filter(
			(product) => product._id !== req.params.id
		);
		if (newProducts.length === allProducts.length) {
			let error = new Error();
			error.httpStatusCode = 404;
			next(error);
		} else {
			await writeDB(productsFilePath, newProducts);
			res.status(200).send(`Product with id:${req.params.id} deleted`);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// "/:id/reviews" GET ALL REVIEWS FOR A SINGLE PRODUCT
router.get("/:id/reviews", async (req, res, next) => {
	try {
		const allReviews = await readDB(reviewsFilePath);
		let reviewsForProduct = allReviews.filter(
			(review) => review.elementId === req.params.id
		);

		if (reviewsForProduct.length === 0) {
			let err = new Error();
			err.httpStatusCode = 404;
			next(err);
		} else {
			res.status(200).send(reviewsForProduct);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// "/:id/reviews" POST A REVIEW FOR A PRODUCT
router.post("/:id/reviews", async (req, res, next) => {
	try {
		const { error } = validateReviewInput(req.body);
		if (error) {
			let err = new Error();
			err.message = error.details[0].message;
			err.httpStatusCode = 400;
			next(err);
		} else {
			const allReviews = await readDB(reviewsFilePath);
			let newReview = {
				...req.body,
				elementId: req.params.id,
				_id: uniqid(),
				createdAt: new Date(),
			};
			allReviews.push(newReview);
			await writeDB(reviewsFilePath, allReviews);
			res.status(200).send(newReview);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

router.put("/:id/reviews", async (req, res, next) => {
	try {
		const { error } = validateReviewInput(req.body);

		let allReviews = await readDB(reviewsFilePath);
		let newReviews = allReviews.filter(
			(review) => review._id !== req.params.id
		);
		console.log("new Review ", newReviews);
		let newReview = {
			...req.body,
			_id: req.params.id,
			updatedAt: new Date(),
		};

		if (error) {
			let err = new Error();
			err.message = error.details[0].message;
			err.httpStatusCode = 400;
			next(err);
		} else if (allReviews.length === newReviews.length) {
			let err = new Error();
			err.httpStatusCode = 404;
			next(err);
		} else {
			newReviews.push(newReview);
			await writeDB(reviewsFilePath, newReviews);
			res.status(200).send(newReview);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// "/:id/reviews" DELETE A REVIEW FOR A PRODUCT
router.delete("/:id/reviews", async (req, res, next) => {
	try {
		const allReviews = await readDB(reviewsFilePath);
		const newReviews = allReviews.filter(
			(review) => review._id !== req.params.id
		);
		if (newReviews.length === allReviews.length) {
			let error = new Error();
			error.httpStatusCode = 404;
			next(error);
		} else {
			await writeDB(reviewsFilePath, newReviews);
			res.status(201).send(`Review with id ${req.params.id} deleted.`);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// "/:id/image" POST IMAGE, ID IS PRODUCT ID
router.post("/:id/image", upload.single("product"), async (req, res, next) => {
	try {
		const imageUrl = path.join(productsPublicFile, `${req.params.id}.jpg`);
		await writeFile(imageUrl, req.file.buffer);
		const allProducts = await readDB(productsFilePath);
		const modifiedProduct = allProducts.find(
			(product) => product._id === req.params.id
		);
		if (!modifiedProduct) {
			let error = new Error();
			error.httpStatusCode = 404;
			next(error);
		} else {
			const newProducts = allProducts.filter(
				(product) => product._id !== req.params.id
			);
			modifiedProduct.imageUrl = imageUrl;
			modifiedProduct.updatedAt = new Date();
			newProducts.push(modifiedProduct);
			await writeDB(productsFilePath, newProducts);
			res.send("Image uploaded.");
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

// SOME IMPROVEMENT ON PRODUCT API
// It returns sum of two product price using XML

/**
 * POST /calculator.asmx HTTP/1.1
Host: www.dneonline.com
Content-Type: application/soap+xml; charset=utf-8
Content-Length: length


 * 
 */
const asyncParser = promisify(parseString);

router.get("/sum/twoPrices", async (req, res, next) => {
	try {
		const { productId1, productId2 } = req.query;

		const xmlData = begin()
			.ele("soap12:Envelope", {
				"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
				"xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
				"xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
			})
			.ele("soap12:Body")
			.ele("Add", { xmlns: "http://tempuri.org/" })
			.ele("intA")
			.text(productId1)
			.up()
			.ele("intB")
			.text(productId2)
			.end();

		try {
			const response = await axios({
				method: "post",
				url: "http://www.dneonline.com/calculator.asmx?op=Add",
				headers: { "Content-Type": "text/xml" },
				body: xmlData,
			});
			res.send(response.data);
		} catch (error) {
			console.log(error);
			next(error);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

module.exports = router;
