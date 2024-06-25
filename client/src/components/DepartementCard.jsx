function DepartmentCard({ department }) {
    return (
        <div>
            <h1>{department.deptName}</h1>
            <p>'Department ID:'{department.deptID}</p>
            <p>'Dept Chair:'{department.deptChair}</p>
            <p>'Dept Admin:'{department.deptAdmin}</p>
            <p>'School:'{department.schoolName}</p>
            <p>'RAS Unit:'{department.rasName}</p>
        </div>
    );
}

export default DepartmentCard;
