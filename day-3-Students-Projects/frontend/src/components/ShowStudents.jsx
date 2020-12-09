import React, { Component } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import AddProject from "./AddProject";
class ShowStudents extends Component {
	state = { students: [], modalShow: false, studentId: "" };

	getStudents = async () => {
		try {
			const response = await fetch("http://localhost:3001/students");

			const students = await response.json();
			console.log(students);
			if (response.ok) {
				this.setState({ students });
			}
		} catch (err) {
			console.log(err);
		}
	};

	deleteUser = async (e) => {
		let id = e.currentTarget.id;
		console.log("id is: ", id);
		console.log("its working");
		try {
			const response = await fetch(
				"http://localhost:3001/students/" + id,
				{
					method: "DELETE",
				}
			);

			if (response.ok) {
				alert("successfuly deleted");
				let students = [...this.state.students];
				let filteredStudents = students.filter((s) => s.id !== id);
				this.setState({ students: filteredStudents });
			} else {
				alert("something went wrong");
			}
		} catch (err) {
			console.log(err);
		}
	};
	componentDidMount() {
		this.getStudents();
	}

	componentDidUpdate(prevProps) {
		prevProps.submittedSize != this.props.submittedSize &&
			this.getStudents();
	}
	render() {
		return (
			<>
				<AddProject
					studentId={this.state.studentId}
					show={this.state.modalShow}
					onHide={() =>
						this.setState({
							modalShow: false,
						})
					}
				/>
				;
				<div className='table-container mt-5'>
					<Container>
						<Table striped bordered hover variant='dark'>
							<thead>
								<tr>
									<th>No</th>
									<th>First Name</th>
									<th>Last Name</th>
									<th>E-mail</th>
									<th>Birth Date</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{this.state.students.map((student, index) => {
									return (
										<tr key={student.id}>
											<td>{index}</td>
											<td>{student.name}</td>
											<td>{student.surname}</td>
											<td>{student.email}</td>
											<td>{student.birthDate}</td>
											<td>
												<div>
													<Button
														id={student.id}
														onClick={
															this.deleteUser
														}
														className='mr-2'
														variant='danger'>
														Delete
													</Button>
													<Button
														className='mr-2'
														variant='success'>
														Edit
													</Button>
													<Button
														onClick={() =>
															this.setState({
																modalShow: true,
																studentId:
																	student.id,
															})
														}
														className='mr-2'
														variant='success'>
														Add Project
													</Button>
													<Link
														to={`/details/${student.id}`}>
														<Button variant='warning'>
															Details
														</Button>
													</Link>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					</Container>
				</div>
			</>
		);
	}
}

export default ShowStudents;
