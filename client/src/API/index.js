const fetchUsers = async () => {
    const response = await fetch('/api/users');
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${text}`);
    }
    const data = await response.json();
    return data;
};

const fetchSingleUser = async (userID) => {
    try {
        const response = await fetch(`/api/users/${userID}`);
        const result = await response.json();
        if (result.error) throw result.error;
        return result.data;
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

export { fetchUsers, fetchSingleUser }