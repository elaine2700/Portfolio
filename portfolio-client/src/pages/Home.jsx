import TitlePage from "../components/TitlePage"
import ProjectCard from "../components/ProjectCard"
import projects from "../data/projects"
import { Link } from "react-router-dom"

const Home = () => {

    const skills = [
        {
            type: "Virtual Reality",
            skills: ["Unity", "C#", "Unreal", "Blueprints", "C++"]
        },
        {
            type: "Web",
            skills: ["HTML", "CSS", "React", "Express.js", "Node.js"]
        },
        {
            type: "Design",
            skills: ["UI", "Photoshop", "Illustrator", "After Effects"]
        }
    ]

    const projectsData = [projects[0], projects[4], projects[2]]

    return (
        <>
            <TitlePage pageName="Home"></TitlePage>
            <section id='content' className='window shadow bg-cream'>
                <div className="padding-sides-medium">
                    <header className="presentation vertical-align">
                        <div className="vertical-align-element inner centered">
                            <h1>Hello,</h1>
                            <h2 className="accent">I am Elaine.
                                <br />
                                Developer &amp; Designer. </h2>
                            <h3>
                                I am passionate about creating immersive and interactive experiences.
                            </h3>
                        </div>
                    </header>

                    <section id="skills">
                        <h1 className="title">Skills</h1>
                        <div className="three-columns">
                            {
                                skills.map((skill, index) => (
                                    <div key={index} className="window shadow h-small">
                                        <h4 className="window-title">{skill.type}</h4>
                                        <ul className="tags">
                                            {
                                                skill.skills.map((tag, index) => (
                                                    <li key={index} className="tag">{tag}</li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                ))
                            }
                        </div>
                    </section>

                    <section id="projects">
                        <h1 className="title">Projects</h1>
                        <div className="three-columns">
                            {
                                projectsData.map((project, index)=>(
                                    <ProjectCard key={index} project={project}/>
                                ))
                            }
                        </div>

                        <div className="space centered">
                            <Link className='clickable'to='/projects'>All Projects</Link>
                        </div>


                    </section>
                </div>

            </section>
        </>
    )
}

export default Home