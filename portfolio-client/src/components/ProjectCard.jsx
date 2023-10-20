
const ProjectCard = ({project}) => {
    return (
        <div className="even-columns fit">
            <div className="frame">
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
                    <button className="centered clickable" >More</button>
                </div>
            </div>
        </div>
    )
}

export default ProjectCard