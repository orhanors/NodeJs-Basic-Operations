import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Container } from "react-bootstrap";
import { withRouter } from "react-router-dom";
/**
 *  - Name
    - Description
    - Creation Date
    - ID
    - RepoURL -> Code Repo URL (es.: GitHub / BitBucket project URL)
    - LiveURL -> URL of the "live" project
    - StudentID
 */
const AddProject = (props) => {
	const [project, setProject] = useState({
		studentId: "",
		name: "",
		description: "",
		repoUrl: "",
		liveUrl: "",
	});

	const [editProject, setEditProject] = useState({
		studentId: "",
		name: "",
		description: "",
		repoUrl: "",
		liveUrl: "",
	});

	useEffect(() => {
		const newProject = { ...project };
		newProject.studentId = props.studentId;
		console.log("newp ", newProject);
		setProject(newProject);

		if (props.project) {
			setEditProject({
				studentId: props.project.studentId,
				name: props.project.name,
				description: props.project.description,
				repoUrl: props.project.repoUrl,
				liveUrl: props.project.liveUrl,
			});
		}
	}, [props.studentId, props.project]);

	const fillForm = (e) => {
		const currentId = e.currentTarget.id;

		const isEditing = props.project;
		if (isEditing) {
			const newProject = { ...editProject };

			newProject[currentId] = e.currentTarget.value;

			setEditProject(newProject);
		} else {
			const newProject = { ...project };

			newProject[currentId] = e.currentTarget.value;

			setProject(newProject);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const isEditing = props.project;

		if (isEditing) {
			try {
				const response = await fetch(
					"http://localhost:3001/projects/" + props.project.id,
					{
						method: "PUT",
						body: JSON.stringify(editProject),
						headers: {
							"Content-type": "application/json",
						},
					}
				);

				if (response.ok) {
					alert("successfully edited");
					props.isElementChanged();
				} else {
					alert("something went wrong");
				}
			} catch (err) {
				alert("something went wrong");
				console.log(err);
			}
		} else {
			try {
				const response = await fetch("http://localhost:3001/projects", {
					method: "POST",
					body: JSON.stringify(project),
					headers: {
						"Content-type": "application/json",
					},
				});

				if (response.ok) {
					alert("successfully added");
					setProject({
						studentId: "",
						name: "",
						description: "",
						repoUrl: "",
						liveUrl: "",
					});
				} else {
					alert("something went wrong");
				}
			} catch (err) {
				alert("something went wrong");
				console.log(err);
			}
		}
	};
	const projectEdit = props.project;
	return (
		<div className='project-modal'>
			<Modal
				{...props}
				size='lg'
				aria-labelledby='contained-modal-title-vcenter'
				centered>
				<Modal.Header closeButton>
					<Modal.Title id='contained-modal-title-vcenter'>
						Add Project
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Container>
						<Form onSubmit={handleSubmit}>
							<fieldset disabled>
								<Form.Group>
									<Form.Label htmlFor='disabledTextInput'>
										Student ID
									</Form.Label>
									<Form.Control
										id='studentId'
										placeholder='Disabled input'
										value={
											projectEdit
												? editProject.studentId
												: props.studentId
										}
										onChange={fillForm}
									/>
								</Form.Group>
							</fieldset>
							<Form.Group controlId='formBasicEmail'>
								<Form.Label>Project Name</Form.Label>
								<Form.Control
									id='name'
									type='text'
									placeholder='Name'
									value={
										projectEdit
											? editProject.name
											: project.name
									}
									onChange={fillForm}
								/>
							</Form.Group>

							<Form.Group controlId='formBasicEmail'>
								<Form.Label>Description</Form.Label>
								<Form.Control
									id='description'
									as='textarea'
									rows={3}
									placeholder='Description'
									value={
										projectEdit
											? editProject.description
											: project.description
									}
									onChange={fillForm}
								/>
							</Form.Group>

							<Form.Group controlId='formBasicEmail'>
								<Form.Label>Repo Url</Form.Label>
								<Form.Control
									id='repoUrl'
									type='url'
									placeholder='Repo Url'
									value={
										projectEdit
											? editProject.repoUrl
											: project.repoUrl
									}
									onChange={fillForm}
								/>
							</Form.Group>

							<Form.Group controlId='formBasicEmail'>
								<Form.Label>Live Url</Form.Label>
								<Form.Control
									id='liveUrl'
									type='url'
									placeholder='Live Url'
									value={
										projectEdit
											? editProject.liveUrl
											: project.liveUrl
									}
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
		</div>
	);
};

export default AddProject;
