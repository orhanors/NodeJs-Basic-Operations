import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import AddReviews from "./AddReviews";

import { getAllReviews, postReview } from "../api/productsApi";
import ShowReviews from "./ShowReviews";
const Reviews = (props) => {
	//productId

	const [review, setReview] = useState({
		comment: "",
		rate: 1,
		elementId: "",
	});
	const [submittedSize, setSubmittedSize] = useState(0);
	const [reviews, setReviews] = useState([]);
	//const [productId, setProductId] = useState(props.productId);

	useEffect(() => {
		let newReview = { ...review };
		newReview.elementId = props.productId;
		setReview(newReview);
	}, [props.productId]);

	const addReview = async (e) => {
		e.preventDefault();
		if (props.productId) {
			const postedRev = await postReview(props.productId, review);
			setSubmittedSize(submittedSize + 1);
		}
	};

	const fillForm = (e) => {
		let currentId = e.currentTarget.id;
		let newReview = { ...review };
		let result = currentId.localeCompare("rate");
		if (result === 0) {
			newReview[currentId] = Number(e.currentTarget.value);
		} else {
			newReview[currentId] = e.currentTarget.value;
		}

		setReview(newReview);
	};
	return (
		<Modal
			{...props}
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered>
			<Modal.Header closeButton>
				<Modal.Title id='contained-modal-title-vcenter'>
					Add New Review
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<AddReviews
					fillForm={fillForm}
					onHandleSubmit={addReview}
					review={review}
				/>
				<ShowReviews
					submittedSize={submittedSize}
					productId={props.productId}
				/>
			</Modal.Body>
		</Modal>
	);
};

export default Reviews;
