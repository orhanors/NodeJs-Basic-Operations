import React, { Component } from "react";
import { Button, Container, Table } from "react-bootstrap";
class StudentDetails extends Component {
	state = { projects: [] };

	getProject = async () => {
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
		this.getProject();
	}
	render() {
		return (
			<Container className='mt-5'>
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
									<td>{index}</td>
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
	}
}

export default StudentDetails;
