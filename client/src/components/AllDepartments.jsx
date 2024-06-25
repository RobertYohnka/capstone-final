import { useState, useEffect } from 'react';
import DepartmentCard from './DepartmentCard';
import { fetchDepartments } from '../API'

function AllDepartments() {
    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);

    useEffect(() => {
        const getDepartments = async () => {
            const departments = await fetchDepartments();
            setDepartments(departments);
            setFilteredDepartments(departments);
        }
        getDepartments()
    }, []);

    const onInputChange = (event) => {
        const searchTerm = event.target.value.toLowerCase()
        const filteredDepartments = departments.filter(department => department.name.toLowerCase().includes(searchTerm))

        setFilteredDepartments(filteredDepartments);
    }

    return (
        <div>
            <h1>Departments</h1>
            <ul>
                <input onChange={onInputChange} />
                {filteredDepartments.map(department => <DepartmentCard key={department.id} department={department.deptName} />)}
            </ul>
        </div>
    );
}

export default AllDepartments;