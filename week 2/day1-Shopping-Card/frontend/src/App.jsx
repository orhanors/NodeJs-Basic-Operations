import "./App.css";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Route } from "react-router-dom";
import BackOffice from "./components/BackOffice";
function App() {
	return (
		<div className='App'>
			<Router>
				<NavBar />

				<Route path='/' exact component={Home} />
				<Route path='/products' component={BackOffice} />

				<Footer />
			</Router>
		</div>
	);
}

export default App;
