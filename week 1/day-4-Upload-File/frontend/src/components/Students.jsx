import React, { Component } from "react";
import AddStudent from "./AddStudent";
import ShowStudents from "./ShowStudents";
class Students extends Component {
	state = {
		addStudent: {
			name: "",
			surname: "",
			email: "",
			birthDate: "",
		},
		submittedSize: 0,
	};

	fillForm = (e) => {
		const currentId = e.currentTarget.id;

		const addStudent = { ...this.state.addStudent };

		addStudent[currentId] = e.currentTarget.value;

		this.setState({ addStudent });
	};

	handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch("http://localhost:3001/students", {
				method: "POST",
				body: JSON.stringify(this.state.addStudent),
				headers: {
					"Content-type": "application/json",
				},
			});

			if (response.ok) {
				alert("successfully added");
				this.setState({ submittedSize: this.state.submittedSize + 1 });
			} else {
				alert("something went wrong");
			}
		} catch (err) {
			console.log(err);
		}
	};
	render() {
		return (
			<React.Fragment>
				<h1 className='text-center my-2'>Students Portfolio</h1>
				<AddStudent
					handleSubmit={this.handleSubmit}
					students={this.state.addStudent}
					fillForm={this.fillForm}
				/>

				<ShowStudents submittedSize={this.state.submittedSize} />
			</React.Fragment>
		);
	}
}

export default Students;
