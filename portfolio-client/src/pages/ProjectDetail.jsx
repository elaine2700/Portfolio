import TitlePage from "../components/TitlePage"
import projects from "../data/projects"
import { Github } from "react-bootstrap-icons";

const ProjectDetail = () => {
    const projectData = projects[0];

    return (
        <>
            <TitlePage pageName={"Projects"}></TitlePage>
            <section id='content' className='window shadow bg-cream'>
                <header className="frame-title">
                    <h1>{projectData.title}</h1>
                    <p>{projectData.description}</p>
                </header>

                <section className="space-top">
                    <div className="centered">
                        <a className="clickable outline wide" href={projectData.linkCode}
                            target="_blank" rel="noopener">View Code <Github/>
                        </a>
                    </div>
                </section>

                <section id="about" className="description">
                    <div className="video">
                        <iframe
                            src="https://drive.google.com/file/d/1Ii90RVWKaRMNgyTDOj1oRKF_dF0z7kIf/preview"
                            allow="autoplay">
                        </iframe>
                    </div>
                    <h3>Characteristics</h3>
                    <ul>
                        <li>Developed in Unity</li>
                        <li>Start Date: May 3d, 2022</li>
                        <li>Final Date: August 12th, 2022</li>
                        <li>Project type: Proof of Concept</li>
                    </ul>
                    <h2>About</h2>
                    <p>
                        Visions of Yesterday is an empathy based Virtual Reality application,
                        created to teach users the trials and tribulations associated with dementia.
                        <br />
                        The intended audience for this project are as follows: dementia care workers,
                        dementia stricken families, and those interested in how VR can teach empathy.
                    </p>
                    
                    <h2>Vision</h2>
                    <p>
                        This project can help teach our potential audience valuable lessons about dementia,
                        through the use of empathy. The vision of the project is to demonstrate that simple tasks,
                        such as finding one's toothbrush, can be almost insurmountable when one has dementia.
                        <br />
                        The user is situated in a house with a caretaker to assist them. The goal of this
                        experience is to generate awareness and empathy for those with dementia by focusing on
                        the visual impairments associated with this disorder.
                    </p>
                    
                    <h3>Team</h3>
                    <ul>
                        <li>Anthony Fusio. 3d Artist</li>
                        <li>Elaine Serrano. Developer, Technical Artist</li>
                        <li>Jorge Leon. Lead Developer</li>
                        <li>William Livingston. Level Designer, Narrative designer</li>
                    </ul>

                </section>
            </section>
        </>
    )
}

export default ProjectDetail