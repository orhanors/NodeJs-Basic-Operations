import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
export default class NavBar extends Component {
	render() {
		return (
			<div className='nav-container'>
				{" "}
				<Navbar bg='dark' variant='dark'>
					<Nav className='mr-auto'>
						<Link to='/'>Home</Link>
						<Link to='/products'>Back Office</Link>
						<Link to='/'>Other</Link>
					</Nav>
				</Navbar>
			</div>
		);
	}
}
