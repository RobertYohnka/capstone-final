const {
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
    fetchAssignments,
    createAssignment,
    destroyAssignment,
    findUserWithToken
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

//for deployment only
const path = require('path');
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use(express.static(path.join(__dirname, '../capstone-client/dist')));

//this is middleware checking if the user is logged in
const isLoggedIn = async (req, res, next) => {
    try {
        req.user = await findUserWithToken(req.headers.authorization);
        next();
    } catch (ex) {
        next(ex);
    }
};

//api routes
app.post('/api/auth/login', async (req, res, next) => {
    try {
        res.send(await authenticate(req.body));
    }
    catch (ex) {
        next(ex);
    }
});

app.post('/api/auth/register', async (req, res, next) => {
    try {
        res.send(await createUserAndGenerateToken(req.body));
    }
    catch (ex) {
        next(ex);
    }
});

app.get('/api/auth/me', isLoggedIn, (req, res, next) => {
    try {
        res.send(req.user);
    }
    catch (ex) {
        next(ex);
    }
});

app.get('/api/users', async (req, res, next) => {
    try {
        res.send(await fetchUsers());
    }
    catch (ex) {
        next(ex);
    }
});

app.get('/api/departments', async (req, res, next) => {
    try {
        res.send(await fetchDepartments());
    }
    catch (ex) {
        next(ex);
    }
});

app.get('/api/roles', async (req, res, next) => {
    try {
        res.send(await fetchRoles());
    }
    catch (ex) {
        next(ex);
    }
});

app.get('/api/users/:id/assignments', async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = Error('not authorized');
            error.status = 401;
            throw error;
        }
        res.send(await fetchAssignments(req.params.id));
    } catch (ex) {
        next(ex);
    }
});

app.post('/api/users/:id/assignments', isLoggedIn, async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = Error('not authorized');
            error.status = 401;
            throw error;
        }
        res.status(201).send(await createAssignment({ user_id: req.params.id, dept_id: req.body.dept_id }));
    } catch (ex) {
        next(ex);
    }
});

app.delete('/api/users/:user_id/assignments/:id', isLoggedIn, async (req, res, next) => {
    try {
        if (req.user.id !== req.params.user_id) {
            const error = Error('not authorized');
            error.status = 401;
            throw error;
        }
        await destroyAssignment({ user_id: req.params.user_id, id: req.params.id });
        res.sendStatus(204);
    } catch (ex) {
        next(ex);
    }
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send({ error: err.message ? err.message : err });
});

const init = async () => {
    const port = process.env.PORT || 3000;
    await client.connect();
    console.log('Connected to database');

    await createTables();
    console.log('tables created');

    const [bob, bill, sarah, amanda, claire, fran, jill] = await Promise.all([
        createUser({ email: 'bob@email.com', password: '123' }),
        createUser({ email: 'bill@email.com', password: '123' }),
        createUser({ emaiol: 'sarah@email.com', password: '123' }),
        createUser({ emaiol: 'amanda@email.com', password: '123' }),
        createUser({ emaiol: 'claire@email.com', password: '123' }),
        createUser({ emaiol: 'fran@email.com', password: '123' }),
        createUser({ emaiol: 'jill@email.com', password: '123' })
    ]);

    const [pathology, dermatology, obgyn, ophthalmology, neurology, neurosurgery, orthopedics] = await Promise.all([
        createDepartment({ deptName: 'pathology', deptID: '736000' }),
        createDepartment({ deptName: 'dermatology', deptID: '736001' }),
        createDepartment({ deptName: 'obgyn', deptID: '736002' }),
        createDepartment({ deptName: 'ophthalmology', deptID: '736003' }),
        createDepartment({ deptName: 'neurology', deptID: '736004' }),
        createDepartment({ deptName: 'neurosurgery', deptID: '736005' }),
        createDepartment({ deptName: 'orthopedics', deptID: '736006' })
    ]);

    const [medicine, publicHealth, nursing, artsAndSciences, primateCenter] = await Promise.all([
        createSchool({ schoolName: 'medicine' }),
        createSchool({ schoolName: 'publicHealth' }),
        createSchool({ schoolName: 'nursing' }),
        createSchool({ schoolName: 'artsAndSciences' }),
        createSchool({ schoolName: 'primateCenter' })
    ]);

    const [rasAdmin, rasManager, rasAD, rasDirector] = await Promise.all([
        createRole({ roleName: 'rasAdmin', management: false }),
        createRole({ roleName: 'rasManager', management: true }),
        createRole({ roleName: 'rasAD', management: true }),
        createRole({ roleName: 'rasDirector', management: true })
    ]);

    const [DrSmith, DrJones, DrJohnson, DrWilliams, DrBrown, DrDavis, DrMiller, DrKeeling, DrFranks, DrJoohnson] = await Promise.all([
        createInvestigator({ email: 'smith@email.com', password: '123' }),
        createInvestigator({ email: 'jones@email.com', password: '123' }),
        createInvestigator({ email: 'johnson@email.com', password: '123' }),
        createInvestigator({ email: 'williams@email.com', password: '123' }),
        createInvestigator({ email: 'brown@email.com', password: '123' }),
        createInvestigator({ email: 'davis@email.com', password: '123' }),
        createInvestigator({ email: 'miller@email.com', password: '123' }),
        createInvestigator({ email: 'keeling@email.com', password: '123' }),
        createInvestigator({ email: 'franks@email.com', password: '123' }),
        createInvestigator({ email: 'joohnson@email.com', password: '123' })
    ]);

    console.log('Sample data seeded');
    app.listen(port, () => console.log(`Listening on port ${port}`));
};

init();