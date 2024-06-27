import React from 'react';
import '../styles/styles.css';

const Services = () => {
    return (
        <section className="services">
            <h2>Our Services</h2>
            <div className="service-cards">
                <div className="card">
                    <h3>Grant Management</h3>
                    <p>Expert assistance with grant applications and management.</p>
                </div>
                <div className="card">
                    <h3>Compliance</h3>
                    <p>Ensuring compliance with institutional and federal regulations.</p>
                </div>
                <div className="card">
                    <h3>Training</h3>
                    <p>Providing training and resources for research administration.</p>
                </div>
            </div>
        </section>
    );
};

export default Services;