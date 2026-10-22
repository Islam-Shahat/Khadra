import { useState } from 'react'
import './Dash.css'

export default function Dash() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            {!isOpen && (
                <button className="menu-button" onClick={() => setIsOpen(true)}>
                    <span className='ham'>☰</span>
                </button>
            )}

            {isOpen && (
                <div className="sidebar">

                    <div className="sidebar-header">
                        <h2>Eslam</h2>

                        <button className="close-button" onClick={() => setIsOpen(false)}>
                            ✕
                        </button>
                    </div>

                    <a href="#home" onClick={() => setIsOpen(false)}>Home</a>
                    <a href="#about" onClick={() => setIsOpen(false)}>About</a>
                    <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>

                    <div className="logout">
                        <button className="logout-button" onClick={() => setIsOpen(false)}>
                            Logout
                        </button>
                    </div>

                </div>
            )}
        </div>
    )
}
