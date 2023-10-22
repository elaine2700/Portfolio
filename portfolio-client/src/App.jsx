import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavSection from './components/NavSection';
import Projects from './pages/Projects'
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import ProjectDetail from './pages/ProjectDetail';
import './assets/app.css'

const App = () => {
  return (
    <Router>
      <div className="grid">

        <NavSection/>

        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='projects' element={<Projects />} />
          <Route path='/project-details' element={<ProjectDetail/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>

        <Footer/>

      </div>
    </Router>
  )
}

export default App