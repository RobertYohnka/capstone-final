import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

const Header = () => {
    return (
        <header className='header'>
            <div className='header-container'>
                <h1>Research Administration Services</h1>
                <nav>
                    <ul>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/services'>Services</Link></li>
                        <li><Link to='/login'>Login</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
