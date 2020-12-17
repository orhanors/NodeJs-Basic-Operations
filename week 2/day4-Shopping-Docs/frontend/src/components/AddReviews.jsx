import React from "react";
import { Form, Button, Container } from "react-bootstrap";
const AddReviews = (props) => {
	return (
		<Container className='add-reviews-form'>
			<Form onSubmit={props.onHandleSubmit}>
				<Form.Group>
					<Form.Label>Comment</Form.Label>
					<Form.Control
						id='comment'
						as='textarea'
						rows={2}
						value={props.review.comment}
						onChange={props.fillForm}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Rate</Form.Label>
					<Form.Control
						id='rate'
						as='select'
						value={props.review.rate}
						onChange={props.fillForm}>
						<option>1</option>
						<option>2 </option>
						<option>3</option>
						<option>4</option>
						<option>5</option>
					</Form.Control>
				</Form.Group>

				<Button variant='primary' type='submit'>
					Submit
				</Button>
			</Form>
		</Container>
	);
};

export default AddReviews;
