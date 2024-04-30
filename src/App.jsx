import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import { Navigate } from 'react-router-dom';

// Routes

const routes = (
  <Router>
    <Routes>
      <Route path="/dashboard" element={<Home />} /> 
      <Route path="/login" element={<Login />} /> 
      <Route path="/signup" element={<SignUp />} /> 
      <Route path="/" element={<Login />} /> 
    </Routes>
  </Router>
);

const App = () => {
  return (
    <div>
      {routes}
    </div>
  );
};

export default App;
