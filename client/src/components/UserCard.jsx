function UserCard({ user }) {
    return (
        <div>
            <div>
                <h1>{user.userName}</h1>
                <p>{`#${user.userID}`}</p>
            </div>
            <button>See Details</button>
        </div>
    );
}

export default UserCard;