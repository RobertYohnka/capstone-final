import React from "react";
import "../styles/styles.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>2024 Research Administration Services. All rights reserved</p>
                <div className='footer-links'>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;