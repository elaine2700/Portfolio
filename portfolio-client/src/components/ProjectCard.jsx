import { Link } from "react-router-dom"

const ProjectCard = ({project}) => {
    return (
        <div className="window card">
            <h4 className="frame-title">{project.title}</h4>
            <div className="thumbnail-fitter">
                <img className="bordered" src={project.image}/>  
                <ul className="tags bordered">
                    <li className="tag">{project.projectType}</li>
                    {
                        project.tools.map((tag, index)=>(
                            <li key={index} className="tag">{tag}</li>
                        ))
                    }
                    {
                        project.programmingLanguages.map((tag, index)=>(
                            <li key={index} className="tag">{tag}</li>
                        ))
                    }
                </ul>
                <Link to='/project-details' className="centered clickable">More</Link>
            </div>
        </div>
    )
}

export default ProjectCard