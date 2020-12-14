import React, { useEffect, useState } from "react";
import { Button, Container, Row, Table, Col } from "react-bootstrap";
const ProjectDetails = (props) => {
	const [reviews, setReviews] = useState([]);

	useEffect(() => {
		getProjects();
	}, []);

	const getProjects = async () => {
		let id = props.match.params.id;
		try {
			const response = await fetch(
				`http://localhost:3001/projects/${id}/reviews`
			);

			const reviews = await response.json();
			console.log("reviews", reviews);
			if (response.ok) {
				setReviews(reviews);
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Container className='mt-3'>
			<Table striped bordered hover variant='dark'>
				<thead>
					<tr>
						<th>No</th>
						<th>Name</th>
						<th>Description</th>

						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{reviews &&
						reviews.map((review, index) => {
							return (
								<tr key={review.id}>
									<td>{index + 1}</td>
									<td>{review.name}</td>
									<td>{review.text}</td>

									<td>
										<div className='d-flex flex-row'>
											<Button
												id={review.id}
												//onClick={this.deletereview}
												className='mr-2'
												variant='danger'>
												Delete
											</Button>
											<Button
												id={review.id}
												className='mr-2'
												variant='success'>
												Edit
											</Button>
										</div>
									</td>
								</tr>
							);
						})}
				</tbody>
			</Table>
		</Container>
	);
};

export default ProjectDetails;
