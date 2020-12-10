import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
const NavBar = () => {
	return (
		<>
			<Navbar bg='dark' variant='dark'>
				<Navbar.Brand href='#home'>Navbar</Navbar.Brand>
				<Nav className='mr-auto'>
					<Link to='/'>Home</Link>
					<Link to='/'>Projects</Link>
					<Link to='/'>XXXX</Link>
				</Nav>
			</Navbar>
		</>
	);
};

export default NavBar;
