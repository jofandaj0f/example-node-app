import './App.css';

import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
// import Footer component
import Footer from "./components/Footer";
// import Header component
import Header from "./components/Header"; 
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
 
const App = () => {
 return (
   <div class="container">
     <Header />
     <Navbar />
     <Home />
     <Footer />
   </div>
 );
};
 
export default App;
