import React from "react";

import { ListGroup, Image, Button } from "react-bootstrap";
function UserCart(props) {
	const cart = props.cart;
	return (
		<div>
			{cart.products && (
				<div>
					<h3 className='text-center my-3'>
						{cart.name} {cart.surname}'s Shopping Cart
					</h3>

					{cart.products.length > 0 ? (
						<ListGroup variant='flush'>
							{cart.products.map((product) => {
								return (
									<ListGroup.Item>
										<div className='d-flex justify-content-around'>
											<Image
												style={{
													width: "50px",
													height: "50px",
												}}
												src={`http://localhost:3001/${product._id}.jpg`}
											/>
											<h5>{product.name}</h5>

											<p>
												{" "}
												<strong>
													${product.price}
												</strong>{" "}
											</p>

											<Button
												variant='danger'
												id={product._id}
												onClick={(e) =>
													props.handleDelete(e)
												}>
												Remove
											</Button>
										</div>
									</ListGroup.Item>
								);
							})}
							<ListGroup.Item className='d-flex justify-content-end mr-5'>
								<strong>Total: </strong> ${cart.total}
							</ListGroup.Item>
						</ListGroup>
					) : (
						<h4 className='text-center'>There is no item!</h4>
					)}
				</div>
			)}
		</div>
	);
}

export default UserCart;
