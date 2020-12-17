import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Container, Image, Spinner, Table } from "react-bootstrap";
import { getProducts, postProductImage } from "../api/productsApi";
import AddProductForm from "./AddProductForm";
import { postProduct, removeProduct } from "../api/productsApi";
const BackOffice = (props) => {
	const [products, setProducts] = useState([]);
	const [product, setProduct] = useState({
		name: "",
		description: "",
		brand: "",
		price: 1,
		category: "Tech",
	});
	const [image, setImage] = useState(null);

	const [submittedSize, setSubmittedSize] = useState(0);

	const [loading, setLoading] = useState(false);
	const [update, setUpdate] = useState(null);
	useEffect(() => {
		const mileStone = async () => {
			await fetchProducts();
		};

		mileStone();
	}, [submittedSize]);

	const fetchProducts = async () => {
		setLoading(true);
		const products = await getProducts();
		setProducts(products);
		setLoading(false);
	};

	const addProduct = async (e) => {
		e.preventDefault();
		if (update !== null) {
			let updateResult = await updateProduct(update._id, update);
			await postProductImage(update._id, image);
			alert("SUCCESS");
			setSubmittedSize(submittedSize + 1);
			console.log(updateResult);
		} else {
			let postedProduct = await postProduct(product);
			const postImg = await postProductImage(postedProduct._id, image);

			setSubmittedSize(submittedSize + 1);
			console.log(postedProduct.errors);
		}
	};

	const fillForm = (e) => {
		let currentId = e.currentTarget.id;
		let newProduct = { ...product };
		newProduct[currentId] = e.currentTarget.value;
		setProduct(newProduct);
	};

	const fillImageForm = (e) => {
		console.log(e.target.files);
		setImage(e.target.files[0]);
	};

	const deleteProduct = async (e) => {
		let id = e.target.id;
		console.log(e.currentTarget);
		await removeProduct(id);
		setSubmittedSize(submittedSize + 1);
	};

	const updateProduct = async (e, product) => {
		setProduct(product);
		setUpdate(product);
	};
	return (
		<div className='back-office'>
			<h1 className='back-office-title text-center my-3'>HOMEROS SHOP</h1>
			<h3 className='back-office-subtitle text-center mb-2'>
				Back Office
			</h3>

			<AddProductForm
				imageForm={fillImageForm}
				product={product}
				fillForm={fillForm}
				onHandleSubmit={addProduct}
				modified={update}
			/>

			<div className='product-table mt-3'>
				<Container>
					<Table striped bordered hover variant='dark'>
						<thead>
							<tr>
								<th>No</th>
								<th>Image</th>
								<th>Name</th>
								<th>Description</th>
								<th>Brand</th>
								<th>Price</th>
								<th>Category</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<Spinner animation='border' role='status'>
									<span className='sr-only'>Loading...</span>
								</Spinner>
							) : (
								<>
									{products &&
										products.map((product, index) => {
											return (
												<tr key={index}>
													<td>{index + 1}</td>
													<td>
														<Image
															style={{
																width: "50px",
																height: "50px",
															}}
															src={`http://localhost:3001/${product._id}.jpg`}
														/>
													</td>
													<td>{product.name}</td>
													<td>
														{product.description}
													</td>
													<td>{product.brand}</td>
													<td>{product.price}</td>
													<td>{product.category}</td>
													<td>
														<Button
															className='mr-2'
															onClick={(e) =>
																updateProduct(
																	e,
																	product
																)
															}>
															Update
														</Button>
														<Button
															id={product._id}
															onClick={(e) =>
																deleteProduct(e)
															}
															variant='danger'>
															Remove
														</Button>
													</td>
												</tr>
											);
										})}
								</>
							)}
						</tbody>
					</Table>
				</Container>
			</div>
		</div>
	);
};

export default BackOffice;
