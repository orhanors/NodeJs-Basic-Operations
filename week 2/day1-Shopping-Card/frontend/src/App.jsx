import "./App.css";
import React, { useState, useEffect } from "react";
import { getCart, removeProductFromCart } from "./api/cartsApi";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Route } from "react-router-dom";
import BackOffice from "./components/BackOffice";
import UserCart from "./components/UserCart";
function App() {
	const [cart, setCart] = useState([]);

	const [deletedSize, setDeletedSize] = useState(0);

	useEffect(() => {
		const handleAsync = async () => {
			getUserCart();
		};
		handleAsync();
	}, [deletedSize]);
	const getUserCart = async () => {
		const cartId = process.env.REACT_APP_CART_ID;
		const data = await getCart("5f6b1991df85440017160811");
		setCart(data);
		console.log(data);
	};
	const deleteProduct = async (e) => {
		const cartId = "5f6b1991df85440017160811";
		const productId = e.target.id;

		const result = await removeProductFromCart(cartId, productId);
		setDeletedSize(deletedSize + 1);
		alert(result);
	};

	return (
		<div className='App'>
			<Router>
				<NavBar />
				<Route
					path='/shoppingCart'
					render={(props) => (
						<UserCart
							{...props}
							cart={cart}
							handleDelete={deleteProduct}
						/>
					)}
				/>
				<Route path='/' exact component={Home} />
				<Route path='/products' component={BackOffice} />

				<Footer />
			</Router>
		</div>
	);
}

export default App;
