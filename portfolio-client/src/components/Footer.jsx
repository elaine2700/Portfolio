import { Github } from "react-bootstrap-icons"
import { Linkedin } from "react-bootstrap-icons"

const Footer = () => {
    return (
        <footer id="contact" className='window shadow'>
            <div>
                <div>
                    <ul className="social-media">
                        <li><a href="https://www.linkedin.com/in/elaine-serrano-echeverria/"><Linkedin/></a></li>
                        <li><a href="https://github.com/elaine2700"><Github/></a></li>
                    </ul>
                    <ul className="page-info">
                        <li>&copy;2023 Elaine Serrano</li>
                        <li>Contact me at <span className="bold"><a href="mailto:contact@elaineserrano.com">contact@elaineserrano.com</a></span></li>
                        <li>Last Updated on October, 2023</li>
                        <li>Designed & coded from Scratch</li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer