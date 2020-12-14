import React, { Component } from "react";
import { Button, Container, Row, Table, Col } from "react-bootstrap";
import AddProject from "./AddProject";
import { Link } from "react-router-dom";
import ReviewAddModal from "./ReviewAddModal";

class StudentDetails extends Component {
	state = {
		projects: [],
		student: {},
		showAddProjectModal: false,
		project: null,
		changedElementSize: 0,
		showAddReviewModal: false,
	};

	getProjects = async () => {
		try {
			const response = await fetch(
				"http://localhost:3001/projects/" + this.props.match.params.id
			);

			const projects = await response.json();
			console.log("projects", projects);
			if (response.ok) {
				this.setState({ projects });
			}
		} catch (err) {
			console.log(err);
		}
	};

	getStudent = async () => {
		let id = this.props.match.params.id;
		try {
			const response = await fetch(
				"http://localhost:3001/students/" + id
			);

			const student = await response.json();
			console.log("singlestun", student);
			if (response.ok) {
				this.setState({ student });
			}
		} catch (err) {
			console.log(err);
		}
	};

	deleteProject = async (e) => {
		let id = e.currentTarget.id;
		console.log("id is: ", id);
		console.log("its working");
		try {
			const response = await fetch(
				"http://localhost:3001/projects/" + id,
				{
					method: "DELETE",
				}
			);

			if (response.ok) {
				alert("successfuly deleted");
				let projects = [...this.state.projects];
				let filteredStudents = projects.filter((s) => s.id !== id);
				this.setState({ projects: filteredStudents });
			} else {
				alert("something went wrong");
			}
		} catch (err) {
			console.log(err);
		}
	};
	componentDidMount() {
		this.getProjects();
		this.getStudent();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.changedElementSize !== this.state.changedElementSize) {
			console.log("updated");
			this.getProjects();
		}
	}

	render() {
		const { student } = this.state;

		return (
			<>
				<AddProject
					isElementChanged={() =>
						this.setState({
							changedElementSize:
								this.state.changedElementSize + 1,
						})
					}
					changedElementSize={this.state.changedElementSize}
					project={this.state.project}
					show={this.state.showAddProjectModal}
					onHide={() =>
						this.setState({
							showAddProjectModal: false,
						})
					}
				/>

				<ReviewAddModal
					project={this.state.project}
					show={this.state.showAddReviewModal}
					onHide={() => this.setState({ showAddReviewModal: false })}
				/>

				<Container className='mt-5'>
					<h1 className='text-center'>
						{student.name} {student.surname} Projects
					</h1>
					<Row>
						<Col md={4}>{console.log("image", student.image)}</Col>

						<Col md={12}>
							<Table striped bordered hover variant='dark'>
								<thead>
									<tr>
										<th>No</th>
										<th>Name</th>
										<th>Description</th>
										<th>Repo</th>
										<th>Live</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{this.state.projects.map(
										(project, index) => {
											return (
												<tr key={project.id}>
													<td>{index + 1}</td>
													<td>{project.name}</td>
													<td>
														{project.description}
													</td>
													<td>{project.repoUrl}</td>
													<td>{project.liveUrl}</td>
													<td>
														<div className='d-flex flex-row'>
															<Button
																id={project.id}
																onClick={
																	this
																		.deleteProject
																}
																className='mr-2'
																variant='danger'>
																Delete
															</Button>
															<Button
																onClick={() =>
																	this.setState(
																		{
																			showAddProjectModal: true,
																			project: project,
																		}
																	)
																}
																id={project.id}
																className='mr-2'
																variant='success'>
																Edit
															</Button>

															<Button
																onClick={() =>
																	this.setState(
																		{
																			showAddReviewModal: true,
																			project: project,
																		}
																	)
																}
																className='mr-2'
																variant='primary'>
																Add Review
															</Button>

															<Link
																to={`/projectDetails/${project.id}`}>
																<Button variant='warning'>
																	Details
																</Button>
															</Link>
														</div>
													</td>
												</tr>
											);
										}
									)}
								</tbody>
							</Table>
						</Col>
					</Row>
				</Container>
			</>
		);
	}
}

export default StudentDetails;
