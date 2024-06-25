function InvestigatorCard({ investigator }) {
    return (
        <div>
            <div>
                <h1>{investigator.invName}</h1>
                <p>'Email:'{investigator.email}</p>
                <p>'Title:'{investigator.invTitle}</p>
                <p>'Employee ID:'{investigator.empID}</p>
                <p>'Commons ID:'{investigator.commonsId}</p>
            </div>
    //add investigator image here
            <button>See Details</button>
        </div>
    )
}

export default InvestigatorCard;

