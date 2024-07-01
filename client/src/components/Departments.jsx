
import React, { useEffect, useState } from 'react';
import '../styles/styles.css';

const Departments = () => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetch('/api/departments')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch departments: ${response.status}`);
                }
                response.json();
            })
            .then(data => {
                console.log('Fetched departments:', data);
                setDepartments(data);
            })
            .catch(error => console.error('Error fetching departments:', error));
    }, []);

    return (
        <section className="departments">
            <h2>Departments</h2>
            <div className="department-list">
                {departments.map(dept => (
                    <div key={dept.id} className="department-card">
                        <h3>{dept.deptName}</h3>
                        <p>Department ID: {dept.deptID}</p>
                        <p>School: {dept.schoolID}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Departments;