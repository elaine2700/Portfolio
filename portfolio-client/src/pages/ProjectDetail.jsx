import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Markdown from 'react-markdown';

import YoutubeEmbedVideo from "../components/YoutubeEmbedVideo";
import TitlePage from "../components/TitlePage";
import projects from "../data/projects";

import { Github } from "react-bootstrap-icons";

const ProjectDetail = () => {
    const projectList = projects;

    const navigate = useNavigate();
    // ?project=1
    const [projectData, setProjectData] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [content, setContent] = useState();

    const findProject = (idParam) => {
        if (Number(idParam) >= projectList.length) {
            navigate('/notFound')
            return console.log('Hello');
        }
        const found = projectList.find((item) => item.id === Number(idParam));
        setProjectData(found);
    };

    const fetchData = () =>{
        setTimeout(()=>{
            fetch(projectData.content)
            .then((res) => {
                return res.text()
            })
            .then((text) => {
                return setContent(text)
            })
            .catch(err => console.log(err))
        }, 100)
    }

    useEffect(() => {
        findProject(searchParams.get('project')); 
    }, []);

    fetchData();

    return (
        <>

            <TitlePage pageName={"Projects"}></TitlePage>
            <section id='content' className='window shadow bg-cream'>
            {
                content ?
                    (
                        <div className="markdown">
                            <header className="frame-title">
                                <h1>{projectData.title}</h1>
                                <p>{projectData.description}</p>
                            </header>

                            <section className="space-top">
                                <div className="centered">
                                    <a className="clickable outline wide" href={projectData.linkCode}
                                        target="_blank" rel="noopener noreferrer">View Code <Github />
                                    </a>
                                </div>
                            </section>

                            <section id="about" className="description">
                                {
                                    projectData.trailer ?
                                        <YoutubeEmbedVideo embedId={projectData.trailer} /> :
                                        <div></div>
                                }

                                <Markdown children={content}/>

                            </section>
                        </div>
                    ) :
                    (
                        <div>Loading...</div>
                    )
            }
            </section>

        </>
    )
}

export default ProjectDetail