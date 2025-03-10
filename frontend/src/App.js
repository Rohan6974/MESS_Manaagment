// import logo from "./logo.svg";
import "./App.css";
import {
  
  Routes,
  Route,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
import React from "react";

function App() {
  return (
    <div className="App-header">
   
        <Routes>
          <Route path="/" element={<Signup/>}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/payment" element={<Payment />} />
        </Routes>

    </div>
  );
}

export default App;
