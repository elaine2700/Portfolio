import ProfileCard from './ProfileCard'
import { Link } from 'react-router-dom'

const NavSection = () => {
  return (
    <header id="personal" className='window shadow'>
          <div>
            <ProfileCard/>

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
  )
}

export default NavSection