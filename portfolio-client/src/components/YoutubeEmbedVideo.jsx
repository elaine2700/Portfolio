import React from 'react'

const YoutubeEmbedVideo = ({ embedId }) => {

    return (
        <div className='video'>
            <iframe
                width="1280"
                height="400"
                src={`https://www.youtube.com/embed/${embedId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
            />
        </div>
    )
}

export default YoutubeEmbedVideo