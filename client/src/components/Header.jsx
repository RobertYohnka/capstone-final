import React from 'react';
import '../styles/styles.css';

const Header = () => {
    return (
        <header className='header'>
            <div className='header-container'>
                <h1>Research Administration Services</h1>
                <nav>
                    <ul>
                        <li><a href='#'>Home</a></li>
                        <li><a href='#'>About</a></li>
                        <li><a href='#'>Services</a></li>
                        <li><a href='#'>Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
