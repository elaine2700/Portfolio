import TitlePage from "../components/TitlePage"
import projects from "../data/projects"
import ProjectCard from "../components/ProjectCard";

const Projects = () => {
    const projectsData = projects;

    return (
        <>
            <TitlePage pageName={"Projects"} />

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
    )
}

export default Projects