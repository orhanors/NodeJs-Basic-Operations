import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Container } from "react-bootstrap";
const ReviewAddModal = (props) => {
	const [review, setReview] = useState({
		projectId: "",
		name: "",
		text: "",
	});

	useEffect(() => {
		if (props.project) {
			let newReview = { ...review };
			newReview.projectId = props.project.id;
			setReview(newReview);
		}
	}, props.project);

	const fillForm = (e) => {
		let currentId = e.currentTarget.id;
		let newReview = { ...review };
		newReview[currentId] = e.currentTarget.value;
		setReview(newReview);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		let id = review.projectId;
		try {
			const response = await fetch(
				`http://localhost:3001/projects/${id}/reviews`,
				{
					method: "POST",
					body: review.name && JSON.stringify(review),
					headers: {
						"Content-type": "application/json",
					},
				}
			);

			if (response.ok) {
				alert("successfully added");
				setReview({
					projectId: "",
					name: "",
					text: "",
				});
			} else {
				alert("something went wrong");
			}
		} catch (err) {
			alert("something went wrong");
			console.log(err);
		}
	};
	return (
		<Modal
			{...props}
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered>
			<Modal.Header closeButton>
				<Modal.Title id='contained-modal-title-vcenter'>
					Add Review
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container>
					<Form onSubmit={handleSubmit}>
						<fieldset disabled>
							<Form.Group>
								<Form.Label htmlFor='disabledTextInput'>
									Project ID
								</Form.Label>
								<Form.Control
									id='projectId'
									placeholder='Disabled input'
									value={props.project && props.project.id}
									onChange={fillForm}
								/>
							</Form.Group>
						</fieldset>
						<Form.Group controlId='formBasicEmail'>
							<Form.Label>Review Title</Form.Label>
							<Form.Control
								id='name'
								type='text'
								placeholder='Review Title'
								value={review.name}
								onChange={fillForm}
							/>
						</Form.Group>

						<Form.Group controlId='formBasicEmail'>
							<Form.Label>Description</Form.Label>
							<Form.Control
								id='text'
								as='textarea'
								rows={3}
								placeholder='Description for review'
								value={review.text}
								onChange={fillForm}
							/>
						</Form.Group>

						<Button variant='primary' type='submit'>
							Submit
						</Button>
					</Form>
				</Container>
			</Modal.Body>
		</Modal>
	);
};

export default ReviewAddModal;
