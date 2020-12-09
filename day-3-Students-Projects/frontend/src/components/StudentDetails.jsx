import React, { Component } from "react";
import { Button, Container, Table } from "react-bootstrap";
import AddProject from "./AddProject";
class StudentDetails extends Component {
	state = {
		projects: [],
		student: {},
		showModal: false,
		projectForEdit: null,
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
	render() {
		const { student } = this.state;
		return (
			<>
				<AddProject
					project={this.state.projectForEdit}
					show={this.state.showModal}
					onHide={() =>
						this.setState({
							showModal: false,
						})
					}
				/>
				<Container className='mt-5'>
					<h1 className='text-center'>
						{student.name} {student.surname} Projects
					</h1>
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
							{this.state.projects.map((project, index) => {
								return (
									<tr key={project.id}>
										<td>{index + 1}</td>
										<td>{project.name}</td>
										<td>{project.description}</td>
										<td>{project.repoUrl}</td>
										<td>{project.liveUrl}</td>
										<td>
											<div className='d-flex flex-row'>
												<Button
													id={project.id}
													onClick={this.deleteProject}
													className='mr-2'
													variant='danger'>
													Delete
												</Button>
												<Button
													onClick={() =>
														this.setState({
															showModal: true,
															projectForEdit: project,
														})
													}
													id={project.id}
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
			</>
		);
	}
}

export default StudentDetails;
