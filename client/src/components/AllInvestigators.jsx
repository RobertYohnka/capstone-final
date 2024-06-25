import { useState, useEffect } from 'react'
import { InvestigatorCard } from './InvestigatorCard'
import { fetchInvestigators } from '../API'

function AllInvestigators() {
    const [investigators, setInvestigators] = useState([]);
    const [filteredInvestigators, setFilteredInvestigators] = useState([]);

    useEffect(() => {
        const getPlayers = async () => {
            const players = await fetchInvestigators();
            setInvestigators(investigators);
            setFilteredInvestigators(investigators);
        }
        getPlayers()
    }, []);

    const onInputChange = (event) => {
        const searchTerm = event.target.value.toLowerCase()
        const filteredInvestigators = investigators.filter(investigator => investigator.name.toLowerCase().includes(searchTerm))
        setFilteredInvestigators(filteredInvestigators);
    }

    return (
        <div>
            <h1>Investigators</h1>
            <ul>
                <input onChange={onInputChange} />
                {filteredInvestigators.map(investigator => <InvestigatorCard key={investigator.id} investigator={investigator.invName} />)}
            </ul>
        </div>
    )
}

export default AllInvestigators;