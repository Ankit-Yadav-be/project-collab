import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './Screens/Home'
import Register from './Screens/Register'
import Login from './Screens/Login'
import Profile from './Screens/Profile'
import ProjectDetail from './Screens/ProjectDetail'
const App = () => {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/project-details" element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App