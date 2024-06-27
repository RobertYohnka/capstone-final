import React from 'react';
import '../styles/styles.css';

const News = () => {
    return (
        <section className="news">
            <h2>Latest Research Admin News</h2>
            <div className="news-cards">
                <div className="card">
                    <h3>Research Administration Services Launches New Website</h3>
                    <p>Check out our new website for the latest news and updates.</p>
                </div>
                <div className="card">
                    <h3>Upcoming Training Sessions</h3>
                    <p>Register for our upcoming training sessions on grant management.</p>
                </div>
                <div className="card">
                    <h3>Research Compliance Updates</h3>
                    <p>Stay up-to-date on the latest research compliance requirements.</p>
                </div>
            </div>
        </section>
    );
};

export default News;