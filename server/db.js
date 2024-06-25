const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/ras_community_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';
if (JWT === 'shhh') {
    console.log('If deployed, set process.env.JWT to something other than shhh');
}

const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS assignments;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS departments;
    DROP TABLE IF EXISTS roles;
    DROP TABLE IF EXISTS investigators;
    DROP TABLE IF EXISTS schools;
    DROP TABLE IF EXISTS rasUnits;

    CREATE TABLE roles(     
        id UUID PRIMARY KEY,
        roleName VARCHAR(20) UNIQUE NOT NULL,
        management BOOLEAN
        );

    CREATE TABLE rasUnits(
        id UUID PRIMARY KEY,
        rasName VARCHAR(20) UNIQUE NOT NULL,
        rasDirector VARCHAR(20),
        rasEmail VARCHAR(20),
        rasWebsite VARCHAR(20)
        );

    CREATE TABLE users(
        id UUID PRIMARY KEY,
        email VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        userName VARCHAR(20),
        jobTitle VARCHAR(20),
        empID VARCHAR(10),
        jobRole VARCHAR(20) REFERENCES roles(roleName),
        rasName VARCHAR(20) REFERENCES rasUnits(rasName),
        );

    CREATE TABLE investigators(
        id UUID PRIMARY KEY,
        email VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        invName VARCHAR(20),
        invTitle VARCHAR(20),
        empID VARCHAR(10),
        commonsId VARCHAR(10),
        );

    CREATE TABLE schools(
        id UUID PRIMARY KEY,
        schoolName VARCHAR(20) UNIQUE NOT NULL,
        schoolID VARCHAR(10),
        schoolDean VARCHAR(20),
        );

    CREATE TABLE departments(
        id UUID PRIMARY KEY,
        deptName VARCHAR(20) UNIQUE NOT NULL,
        deptID VARCHAR(10),
        deptChair VARCHAR(20),
        deptAdmin VARCHAR(20),
        schoolName VARCHAR(20) REFERENCES schools(schoolName),
        rasName VARCHAR(20) REFERENCES rasUnits(rasName),
        );

    CREATE TABLE assignments(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        dept_id UUID REFERENCES departments(id),
        CONSTRAINT unique_assignment UNIQUE(user_id, dept_id)
        );
    `;
    await client.query(SQL);

};

const createSchool = async ({ schoolName, schoolID, schoolDean }) => {
    const SQL = `
    INSERT INTO schools(schoolName, schoolID, schoolDean)
    VALUES($1, $2, $3)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), schoolName, schoolID, schoolDean]);
    return response.rows[0];
};

const createDepartment = async ({ deptName, deptID, deptChair, deptAdmin, schoolName, rasName }) => {
    const SQL = `
    INSERT INTO departments(deptName, deptID, deptChair, deptAdmin, schoolName, rasName)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), deptName, deptID, deptChair, deptAdmin, schoolName, rasName]);
    return response.rows[0];
};

const createUser = async ({ email, password, name, jobTitle, empID, jobRole, rasName }) => {
    const SQL = `
    INSERT INTO users(email, password, name, jobTitle, empID, jobRole, rasName)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), email, password, name, jobTitle, empID, jobRole, rasName]);
    return response.rows[0];
};

const createUserAndGenerateToken = async ({ email, password }) => {
    const user = await createUser({ email, password });
    const token = await jwt.sign({ id: user.id }, JWT);
    return { token };
}

const createRole = async ({ roleName, management }) => {
    const SQL = `
    INSERT INTO roles(roleName, management)
    VALUES($1, $2)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), roleName, management]);
    return response.rows[0];
};

const createInvestigator = async ({ email, password, name, invTitle, empID, commonsId }) => {
    const SQL = `
    INSERT INTO investigators(email, password, name, invTitle, empID, commonsId)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), email, password, name, invTitle, empID, commonsId]);
    return response.rows[0];
};

const fetchUsers = async () => {
    const SQL = `
    SELECT * FROM users;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchDepartments = async () => {
    const SQL = `
    SELECT * FROM departments;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchInvestigators = async () => {
    const SQL = `
    SELECT * FROM investigators;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchAssignments = async (user_id) => {
    const SQL = `
    SELECT * FROM assignments WHERE user_id=$1
    `;
    const response = await client.query(SQL, [user_id]);
    return response.rows;
};

const createAssignment = async ({ user_id, dept_id }) => {
    const SQL = `
    INSERT INTO assignments(user_id, dept_id)
    VALUES($1, $2)
    RETURNING *;
    `;
    const response = await client.query(SQL, [user_id, dept_id]);
    return response.rows[0];
};

const destroyAssignment = async ({ user_id, id }) => {
    const SQL = `
    DELETE FROM assignments WHERE user_id=$1 AND id=$2
    `;
    await client.query(SQL, [user_id, id]);
};

const authenticate = async ({ email, password }) => {
    const SQL = `
    SELECT id, email, password FROM users WHERE email=$1;
    `;
    const response = await client.query(SQL, [email]);
    if (!response.rows.length || (await bcrypt.compare(password, response.rows[0].password)) === false) {
        const error = Error('bad credentials');
        error.status = 401;
        throw error;
    }
    const token = jwt.sign({ id: response.rows[0].id }, JWT);
    return { token };
};

const findUserWithToken = async (token) => {
    let id;
    try {
        const payload = await jwt.verify(token, JWT);
        id = payload.id;
    } catch (ex) {
        const error = Error('not authorized');
        error.status = 401;
        throw error;
    }
    const SQL = `
    SELECT id, email FROM users WHERE id=$1;
    `;
    const response = await client.query(SQL, [id]);
    if (!response.rows.length) {
        const error = Error('not authorized');
        error.status = 401;
        throw error;
    }
    return response.rows[0];
};


module.exports = {
    client,
    authenticate,
    createTables,
    createUser,
    createDepartment,
    createSchool,
    createRole,
    createInvestigator,
    fetchUsers,
    fetchDepartments,
    fetchInvestigators,
    fetchAssignments,
    createAssignment,
    destroyAssignment,
    authenticate,
    findUserWithToken,
    createUserAndGenerateToken
};
