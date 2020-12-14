import React, { Component } from "react";
import { Container, Form, Button } from "react-bootstrap";

const AddStudent = (props) => {
	const { handleSubmit, students, fillForm } = props;
	return (
		<div className='form-container'>
			<Container>
				<Form onSubmit={handleSubmit}>
					<Form.Group controlId='formBasicEmail'>
						<Form.Label>Name</Form.Label>
						<Form.Control
							id='name'
							type='text'
							placeholder='Name'
							value={students.name}
							onChange={fillForm}
						/>
					</Form.Group>

					<Form.Group controlId='formBasicEmail'>
						<Form.Label>Surname</Form.Label>
						<Form.Control
							id='surname'
							type='text'
							placeholder='Surname'
							value={students.surname}
							onChange={fillForm}
						/>
					</Form.Group>

					<Form.Group controlId='formBasicEmail'>
						<Form.Label>Email address</Form.Label>
						<Form.Control
							id='email'
							type='email'
							placeholder='Enter email'
							value={students.email}
							onChange={fillForm}
						/>
					</Form.Group>

					<Form.Group>
						<Form.Control
							id='birthDate'
							type='date'
							value={students.birthDate}
							onChange={fillForm}
						/>
					</Form.Group>
					<Button variant='primary' type='submit'>
						Submit
					</Button>
				</Form>
			</Container>
		</div>
	);
};

export default AddStudent;
