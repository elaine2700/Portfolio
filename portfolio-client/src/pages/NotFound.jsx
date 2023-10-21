import React from 'react'
import TitlePage from '../components/TitlePage'

const NotFound = () => {
  return (
    <>
            <TitlePage pageName="Oops!"></TitlePage>
            <section id='content' className='window'>
                <div>
Page Not Found
                </div>

            </section>
        </>
  )
}

export default NotFound