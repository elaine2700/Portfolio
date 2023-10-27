import { Link } from "react-router-dom"
import { useState, useEffect } from "react";

const ProjectCard = ({ project }) => {

    // fullDescription, cardOnly
    const [view, setView] = useState('fullDescription');

    useEffect(() => {
        setView(project.infoAvailable)
    }, [])

    const URL = `/project-details?project=${project.id}`;

    return (
        <div className="window card">
            <h4 className="frame-title">{project.title}</h4>
            <div className="thumbnail-fitter">
                <img className="bordered" src={project.image} />
                <ul className="tags bordered">
                    <li className="tag">{project.projectType}</li>
                    {
                        project.tools.map((tag, index) => (
                            <li key={index} className="tag">{tag}</li>
                        ))
                    }
                    {
                        project.programmingLanguages.map((tag, index) => (
                            <li key={index} className="tag">{tag}</li>
                        ))
                    }
                </ul>
                {
                    project.content ?
                        (
                            <Link to={URL} className="centered clickable">More</Link>
                        ) :
                        (<div className="tags centered">
                            <a href={project.live} className="clickable"
                            target="_blank" rel="noopener noreferrer">Live</a>
                            <a href={project.linkCode} className="clickable"
                            target="_blank" rel="noopener noreferrer">Code</a>
                        </div>)
                }

            </div>
        </div>
    )
}

export default ProjectCard