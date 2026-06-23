import React, { useState } from 'react'
import Search from './components/Search'
import Main from './components/Main'
import Header from './components/Header'

export default function App() {
    const [currentView, setCurrentView] = useState('search')
    const [selectedImage, setSelectedImage] = useState('')

    function handleSelectImage(url) {
        setSelectedImage(url)
        setCurrentView('editor')
    }

    return (
        <>
        <Header />
        <div>
            {currentView === 'search' ? (
                <Search onSelectImage={handleSelectImage} />
            ) : (
                <Main 
                    initialImageUrl={selectedImage} 
                    onBackToSearch={() => setCurrentView('search')} 
                />
            )}
        </div>
        </>
    )
}