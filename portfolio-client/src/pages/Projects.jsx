import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TitlePage from "../components/TitlePage"
import projects from "../data/projects"
import ProjectCard from "../components/ProjectCard";
import FilterButtons from "../components/FilterButtons";

const Projects = () => {
    const projectsData = projects;
    const [cards, setCards] = useState(projectsData);

    // url params
    const [searchParams, setSearchParams] = useSearchParams({});

    const categories = [...new Set(projectsData.map((val) => val.projectType))]

    // Function to filter items
    const filterItem = (filter) => {
        console.log(`Filtering... by ${filter}`)
        const newItem = projectsData.filter((newVal) => {
            return newVal.projectType === filter;
        })
        setCards(newItem);
        console.log(newItem);
    }

    // get the project type from url
    const urlFilter = (query) => {

        if (!query.get('type')) {
            setCards(projectsData);
            return console.log('not query')
        }

        const type = query.get('type');
        console.log(query.get('type'));
        if (categories.includes(type)) {
            filterItem(type);
        }
    }

    const setUrlType = (newType) => {
        setSearchParams({type: `${newType}`})
    }

    useEffect(() => {
        urlFilter(searchParams);
    }, [])

    return (
        <>
            <TitlePage pageName={"Projects"} />

            <section id='content' className='window bg-cream shadow'>
                <div>
                    <FilterButtons 
                        setItems={setCards} 
                        allItems={projectsData} 
                        filterItem={filterItem} 
                        categories={categories} 
                        setUrl={setUrlType}/>
                    <div className="even-columns fit">
                        {
                            cards.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))
                        }
                    </div>
                </div>

            </section>
        </>
    )
}

export default Projects