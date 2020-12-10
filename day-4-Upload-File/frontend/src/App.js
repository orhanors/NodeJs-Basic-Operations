import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Students from "./components/Students";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Route } from "react-router-dom";
import StudentDetails from "./components/StudentDetails";
import AddProject from "./components/AddProject";
import ProjectDetails from "./components/ProjectDetails";
function App() {
	return (
		<div className='App'>
			<Router>
				<NavBar />

				<Route path='/details/:id' component={StudentDetails} />
				<Route path='/projectDetails/:id' component={ProjectDetails} />
				<Route path='/' exact component={Students} />
			</Router>
		</div>
	);
}

export default App;
