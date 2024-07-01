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
    DROP TABLE IF EXISTS proposedEffort;
    DROP TABLE IF EXISTS awardedEffort;
    DROP TABLE IF EXISTS proposals;
    DROP TABLE IF EXISTS awards;
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
        rasID VARCHAR(10),
        rasDirector VARCHAR(20),
        rasEmail VARCHAR(50),
        rasWebsite VARCHAR(50)
    );

    CREATE TABLE users(
        id UUID PRIMARY KEY,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        userName VARCHAR(50),
        jobTitle VARCHAR(50),
        userID VARCHAR(10) UNIQUE NOT NULL,
        jobRole VARCHAR(20) REFERENCES roles(roleName),
        rasName VARCHAR(20) REFERENCES rasUnits(rasName)
    );

    CREATE TABLE investigators(
        id UUID PRIMARY KEY,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        invName VARCHAR(50),
        invTitle VARCHAR(50),
        invID VARCHAR(10) UNIQUE NOT NULL,
        commonsId VARCHAR(10)
    );

    CREATE TABLE schools(
        id UUID PRIMARY KEY,
        schoolName VARCHAR(50) NOT NULL,
        schoolID VARCHAR(10) NOT NULL UNIQUE,
        schoolDean VARCHAR(50)
    );

    CREATE TABLE departments(
        id UUID PRIMARY KEY,
        deptName VARCHAR(50) UNIQUE NOT NULL,
        deptID VARCHAR(10) UNIQUE NOT NULL,
        deptChair VARCHAR(50),
        deptAdmin VARCHAR(50),
        schoolID VARCHAR(10) REFERENCES schools(schoolID),
        rasName VARCHAR(20) REFERENCES rasUnits(rasName)
    );

    CREATE TABLE proposals(
        id UUID PRIMARY KEY,
        epexID INT UNIQUE,
        propTitle VARCHAR(150),
        propPrimeSponsor VARCHAR(50),
        propAwardingEntity VARCHAR(50),
        propOpportunityID VARCHAR(50),
        propSponsorType VARCHAR(50),
        propSource VARCHAR(20), 
        propPlaceOfPerformance VARCHAR(50),
        propDueDate DATE,
        propStart DATE,
        propEnd DATE,
        propNumberYears INT,
        propMajorGoals VARCHAR(900),
        propSpecificAims VARCHAR(900),
        propSubmittingRAS VARCHAR(20),
        propPreSubmitter VARCHAR(20)
    );

    CREATE TABLE awards(
        id UUID PRIMARY KEY,
        awardID INT UNIQUE,
        awardTitle VARCHAR(150),
        awardPrimeSponsor VARCHAR(50),
        awardAwardingEntity VARCHAR(50),
        awardSponsorType VARCHAR(50),
        awardSource VARCHAR(20), 
        awardPlaceOfPerformance VARCHAR(50),
        awardStart DATE,
        awardEnd DATE,
        awardNumberYears INT,
        awardMajorGoals VARCHAR(900),
        awardSpecificAims VARCHAR(900),
        awardManagingRAS VARCHAR(20),
        awardPostContact VARCHAR(20)
    );

    CREATE TABLE proposedEffort (
        id UUID PRIMARY KEY,
        epexID INT REFERENCES proposals(epexID),
        propInvID VARCHAR(10) REFERENCES investigators(invID),
        propYr1effort NUMERIC(5,2),
        propYr2effort NUMERIC(5,2),
        propYr3effort NUMERIC(5,2),
        propYr4effort NUMERIC(5,2),
        propYr5effort NUMERIC(5,2),
        propYr6effort NUMERIC(5,2),
        propYr7effort NUMERIC(5,2),
        propYr8effort NUMERIC(5,2),
        propYr9effort NUMERIC(5,2),
        propYr10effort NUMERIC(5,2)
    );

    CREATE TABLE awardedEffort (
        id UUID PRIMARY KEY,
        awardID INT REFERENCES awards(awardID),
        awrdInvID VARCHAR(10) REFERENCES investigators(invID),
        awardYr1effort NUMERIC(5,2),
        awardYr2effort NUMERIC(5,2),
        awardYr3effort NUMERIC(5,2),
        awardYr4effort NUMERIC(5,2),
        awardYr5effort NUMERIC(5,2),
        awardYr6effort NUMERIC(5,2),
        awardYr7effort NUMERIC(5,2),
        awardYr8effort NUMERIC(5,2),
        awardYr9effort NUMERIC(5,2),
        awardYr10effort NUMERIC(5,2)
    );

    CREATE TABLE assignments(
        id UUID PRIMARY KEY,
        dept_id UUID REFERENCES departments(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_assignment UNIQUE(user_id, dept_id)
    );
    `;
    await client.query(SQL);
};

const createSchool = async ({ schoolName, schoolID }) => {
    const SQL = `
    INSERT INTO schools(id, schoolName, schoolID)
    VALUES($1, $2, $3)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), schoolName, schoolID]);
    return response.rows[0];
};

const createRasUnit = async ({ rasName, rasID, rasDirector, rasEmail, rasWebsite }) => {
    const SQL = `
    INSERT INTO rasUnits(id, rasName, rasID, rasDirector, rasEmail, rasWebsite)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), rasName, rasID, rasDirector, rasEmail, rasWebsite]);
    return response.rows[0];
}

const createDepartment = async ({ deptName, deptID, schoolID }) => {
    const SQL = `
    INSERT INTO departments(id, deptName, deptID, schoolID) 
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), deptName, deptID, schoolID]);
    return response.rows[0];
};

const createUser = async ({ userName, email, password, userID }) => {
    const SQL = `
    INSERT INTO users(id, userName, email, password, userID)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), userName, email, password, userID]);
    return response.rows[0];
};

const createUserAndGenerateToken = async ({ email, password }) => {
    const user = await createUser({ email, password });
    const token = await jwt.sign({ id: user.id }, JWT);
    return { token };
}

const createRole = async ({ roleName, management }) => {
    const SQL = `
    INSERT INTO roles(id, roleName, management)
    VALUES($1, $2, $3)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), roleName, management]);
    return response.rows[0];
};

const createInvestigator = async ({ invName, email, password, invID }) => {
    const SQL = `
    INSERT INTO investigators(id, invName, email, password, invID)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), invName, email, password, invID]);
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

const fetchRoles = async () => {
    const SQL = `
    SELECT * FROM roles;
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

//also consider fetch assignmnets by dept_id or by RAS Unit but only for management roles

const createAssignment = async ({ user_id, dept_id }) => {
    const SQL = `
    INSERT INTO assignments(id, user_id, dept_id)
    VALUES($1, $2, $3)
    RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), user_id, dept_id]);
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
    createRasUnit,
    createRole,
    createInvestigator,
    fetchUsers,
    fetchDepartments,
    fetchInvestigators,
    fetchRoles,
    fetchAssignments,
    createAssignment,
    destroyAssignment,
    authenticate,
    findUserWithToken,
    createUserAndGenerateToken
};
