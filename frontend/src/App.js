// import logo from "./logo.svg";
import "./App.css";
import {
  
  Routes,
  Route,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <div className="App-header">
   
        <Routes>
          <Route path="/" element={<Signup/>}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/home" element={<Home/>} />
        </Routes>

    </div>
  );
}

export default App;
