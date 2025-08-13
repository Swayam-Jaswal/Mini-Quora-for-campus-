import { useState } from 'react'
import './App.css'
import Register from './components/auth/signup/signup';
import Login from './components/auth/login/login';

function App() {
  return (
    <>
    <Register/>
    <Login/>
    </>
  )
}

export default App