import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Students from "./components/Students";
function App() {
	return (
		<div className='App'>
			<h1 className='text-center'>Students Portfolio</h1>
			<Students />
		</div>
	);
}

export default App;
