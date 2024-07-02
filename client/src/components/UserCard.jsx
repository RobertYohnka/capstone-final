function UserCard({ user }) {
    return (
        <div>
            <div>
                <h1>{user.username}</h1>
                <p>{`#${user.userid}`}</p>
            </div>
            <button>See Details</button>
        </div>
    );
}

export default UserCard;