import ProfileCard from './ProfileCard';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {List, X} from 'react-bootstrap-icons'

const NavSection = () => {

  const [popMenu, setPopMenu] = useState(true);
  const [navBarClass, setNavBarClass] = useState('main-nav');
  const [toggleClass, setToggleClas] = useState('toggle');

  const toggleMenu = () => {
    setPopMenu(!popMenu);
    if(popMenu){
      setNavBarClass('main-nav display window')
      setToggleClas('toggle clickable outline')
    }  
    else {
      setNavBarClass('main-nav')
      setToggleClas('toggle clickable')
    }
      
      
  };

  return (
    <header id="personal" className='window shadow'>
          <div>
            <ProfileCard/>
            <nav className={navBarClass} >
              
              <ul>
                <li className={toggleClass}>
                <a  onClick={toggleMenu}>
                {
                  popMenu ? <List/> : <X/>
                }
              </a>
                </li>
                <li>
                  <Link to='/' className='clickable outline' onClick={toggleMenu}>Home</Link>
                  </li>
                <li>
                  <Link to='/projects' className='clickable outline' onClick={toggleMenu}>Projects</Link>
                </li>
                <li>
                  <Link to='/resume' className='clickable outline' onClick={toggleMenu}>Resume</Link>
                  </li>
              </ul>
            </nav>
          </div>
        </header>
  )
}

export default NavSection