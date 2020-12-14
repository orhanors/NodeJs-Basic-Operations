export async function getCart(cartID) {
	try {
		const response = await fetch(`http://localhost:3001/carts/${cartID}`);
		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			const error = await response.json();
			return error;
		}
	} catch (error) {
		console.log(error);
	}
}

export async function removeProductFromCart(cartId, productId) {
	try {
		const response = await fetch(
			`http://localhost:3001/carts/${cartId}/remove-from-cart/${productId}`,
			{
				method: "DELETE",
			}
		);
		if (response.ok) {
			return "Product Deleted";
		} else {
			return response.json();
		}
	} catch (error) {
		return error;
	}
}

export async function addProductToCart(cartId, productId) {
	try {
		const response = await fetch(
			`http://localhost:3001/carts/${cartId}/add-to-cart/${productId}`,
			{
				method: "POST",
				//headers: { "Content-Type": "application/json" },
			}
		);
		if (response.ok) {
			return "Product Added Successfully";
		} else {
			return response.json();
		}
	} catch (error) {
		return error;
	}
}
//
