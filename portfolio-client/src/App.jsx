import React, {useState} from 'react'
import ProjectCard from './components/ProjectCard'
import projects from './data/projects.js'
import './assets/app.css'
import BackButton from './components/BackButton'

const App = () => {
  const [view, setView] = useState('');
  const projectsData = projects;

  return (
    <div className="grid">
      <header id="personal" className='window'>
        <div>
          <div className="profile-card frame bg-cream">
            <div className="profile-image">
              <img id="icon-base" src="src/assets/images/Icon_Base.png" />
              <img id="icon-lens" className="invisible transition-right" src="images/Icon_HMD.png" />
              <div id="VR-checkbox">
                {
                  //<span>VR</span>
                  //<input id="VR-Toggle" type="checkbox"/>
                  //<label className="switch" for="VR-Toggle"></label>
                }

              </div>
            </div>
            <div className="name">
              <h1>Elaine Serrano</h1>
              <h2>Developer & Designer</h2>
            </div>
          </div>
          <nav className="main-nav">
            <ul>
              <li className="toggle"><a className="clickable"><i className="icon fa fa-bars"></i></a></li>
              <li><a className="clickable" href="index.html">Home</a></li>
              <li><a className="clickable current-selection" href="projects.html">Projects</a></li>
              <li className="hide"><a className="clickable" href="resume.html">Resume</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <>
      <section id='content-title' className='window'>
        <header>
          <BackButton />
          <h1 className="section-title">Projects</h1>
        </header>
      </section>

      
      <section id='content' className='window'>
        <div>
          {
            projectsData.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          }
        </div>

      </section>
      </>

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
  )
}

export default App