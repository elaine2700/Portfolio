import React from 'react'
import BackButton from './BackButton'

const TitlePage = ({ pageName }) => {
    return (
        <section id='content-title'>
            <header>
                
                <h1 className="section-title">{pageName}</h1>
                
            </header>
        </section>
    )
}

export default TitlePage