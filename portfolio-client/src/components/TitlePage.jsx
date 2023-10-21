import React from 'react'
import BackButton from './BackButton'

const TitlePage = ({ pageName }) => {
    return (
        <section id='content-title' className='window'>
            <header>
                <BackButton />
                <h1 className="section-title">{pageName}</h1>
                <span></span>
            </header>
        </section>
    )
}

export default TitlePage