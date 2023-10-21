import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Projects from './pages/Projects'
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import './assets/app.css'
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="grid">
        <header id="personal" className='window'>
          <div>
            <div className="profile-card frame bg-cream">
              <div className="profile-image">
                <img id="icon-base" src="/src/assets/images/Icon_Base.png" />
                <img id="icon-lens" className="invisible transition-right" src="src/assets/images/Icon_HMD.png" />
                <div id="VR-checkbox">
                  
                    <span>VR</span>
                    <input id="VR-Toggle" type="checkbox"/>
                    <label className="switch" htmlFor="VR-Toggle"></label>
                  

                </div>
              </div>
              <div className="name">
                <h1>Elaine Serrano</h1>
                <h2>Developer & Designer</h2>
              </div>
            </div>
            <nav className="main-nav">
              <ul>
                <li className="toggle">
                  <a className="clickable"><i className="icon fa fa-bars"></i></a></li>
                <li>
                  <Link to='/' className='clickable'>Home</Link>
                  </li>
                <li>
                  <Link to='/projects' className='clickable'>Projects</Link>
                </li>
                <li>
                  <Link to='/resume' className='clickable'>Resume</Link>
                  </li>
              </ul>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='projects' element={<Projects />} />
          <Route path='*' element={<NotFound/>}/>
        </Routes>

        <footer id="contact" className='window'>
          <div>
            <div>
              <ul className="social-media">
                <li><a href="https://www.linkedin.com/in/elaine-serrano-echeverria/" className="fa-brands fa-linkedin"></a></li>
                <li><a href="https://github.com/elaine2700" className="fa-brands fa-github"></a></li>
              </ul>
              <ul className="page-info">
                <li>&copy;2023 Elaine Serrano</li>
                <li>Contact me at <span className="bold"><a href="mailto:contact@elaineserrano.com">contact@elaineserrano.com</a></span></li>
                <li>Last Updated on February, 2023</li>
                <li>Designed & coded from Scratch</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App