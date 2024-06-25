import React, { useEffect, useState } from 'react';


const HomePage = () => {
    <>
        {
            !auth.id ? <>
                <Login login={login} />
                <Register register={register} />
            </>
                : <button onClick={Logout}>Logout {auth.email}</button>
        }
        <li>
            {
                fetchDepartments.map(department => {
                    return (
                        <li key={department.id}>
                            {department.name}
                            {
                                <button onClick={() => listOfInvestigators(department.id)}>View Investigators</button>
                            }
                        </li>
                    );
                })
            }
        </li>
    </>
}