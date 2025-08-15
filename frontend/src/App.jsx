import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import './App.css'
import Register from './components/auth/signup/signup';
import Login from './components/auth/login/login';
import VerifyEmail from "./components/pages/verifyEmail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/verify-email" element={<VerifyEmail/>}/>
      </Routes>
    </Router>
  )
}

export default App