const express = require("express");
const { readDB, writeDB } = require("../../lib/utilities");
const { check, validationResult } = require("express-validator");
const { join } = require("path");
const router = express.Router();

const cartJsonFilePath = join(__dirname, "carts.json");
const productsJsonFilePath = join(__dirname, "../products/products.json");
/**
 *  {   _id: "5f6b1991df85440017160814", // cart unique identifier
      ownerId: "5f6b1991df8544001716080i", // a string with the current user id
      name: "Riccardo",
      surname: "Gulin",
      products : [] // an array containing the added products (or just the fields which are relevant, {_id, name, price,..})
      total: 0 // a number with the total price of the added products
  },
 */

const cartValidation = [];
router.post("/:cartId/add-to-cart/:productId", async (req, res, next) => {
	try {
		let allCards = await readDB(cartJsonFilePath);
		const card = allCards.find((c) => c._id === req.params.cartId);

		if (card) {
			const cartIndex = allCards.findIndex(
				(card) => card._id === req.params.cartId
			);
			const allProducts = await readDB(productsJsonFilePath);
			const product = allProducts.find(
				(p) => p._id === req.params.productId
			);

			if (product) {
				card.products.push(product);
				let totalPrice = card.total;
				totalPrice += Number(product.price);
				card.total = totalPrice;
				allCards = [
					...allCards.slice(0, cartIndex),
					card,
					...allCards.slice(cartIndex + 1),
				];

				await writeDB(cartJsonFilePath, allCards);
				res.status(200).send(`Successfully added: ${card}`);
			} else {
				const err = new Error();
				err.httpStatusCode = 400;
				err.message = "product not found!";
				next(err);
			}
		} else {
			const err = new Error();
			err.httpStatusCode = 400;
			err.message = "Card not found!";
			next(err);
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
});

router.get("/:cartId", async (req, res, next) => {
	try {
		let allCards = await readDB(cartJsonFilePath);
		const card = allCards.find((c) => c._id === req.params.cartId);

		if (card) {
			res.status(200).send(card);
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

router.delete(
	"/:cartId/remove-from-cart/:productId",
	async (req, res, next) => {
		try {
			let allCards = await readDB(cartJsonFilePath);
			const card = allCards.find((c) => c._id === req.params.cartId);
			const cardIndex = allCards.findIndex(
				(c) => c._id === req.params.cartId
			);
			console.log("spesific card : ", card);
			if (card) {
				const product = card.products.find(
					(p) => p._id === req.params.productId
				);

				if (product) {
					const products = card.products.filter(
						(p) => p._id !== req.params.productId
					);

					card.products = [...products];
					let totalPrice = card.total;
					totalPrice -= Number(product.price);
					card.total = totalPrice;

					allCards = [
						...allCards.slice(0, cardIndex),
						card,
						...allCards.slice(cardIndex + 1),
					];

					await writeDB(cartJsonFilePath, allCards);
					res.status(201).send("successfuly deleted");
				} else {
					const err = new Error();
					err.httpStatusCode = 400;
					err.message = "Product not found!";
					next(err);
				}
			} else {
				const err = new Error();
				err.httpStatusCode = 400;
				err.message = "Cart not found!";
				next(err);
			}
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
);
module.exports = router;
