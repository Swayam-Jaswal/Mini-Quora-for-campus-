import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import './App.css'
import Register from './features/auth/pages/Signup';
import Login from './features/auth/pages/Login';
import VerifyEmail from "./features/auth/pages/VerifyEmail";

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