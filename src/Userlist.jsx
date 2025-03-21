import { useState, useEffect } from 'react';
import './Userlist.css';
import { FaCirclePlus } from "react-icons/fa6";

const Userlist = () => {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [newUser, setNewUser] = useState({ id: '', name: '', department: '', role: '' });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/users.json');
        const data = await response.json();
        const finalUsers = data.map((user, index) => ({ id: index + 1, ...user }));
        setUsers(finalUsers);
        setOriginalUsers(finalUsers);
        localStorage.setItem('users', JSON.stringify(finalUsers));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    const savedUsers = localStorage.getItem('users');
    if (savedUsers && JSON.parse(savedUsers).length > 0) {
      const parsedUsers = JSON.parse(savedUsers);
      setUsers(parsedUsers);
      setOriginalUsers(parsedUsers);
      setIsLoaded(true);
    } else {
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    if (isLoaded && users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users, isLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUserWithId = { ...newUser, id: users.length + 1 };
    

    if (isSorted) {
      const updatedSortedUsers = [...users, newUserWithId].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      setUsers(updatedSortedUsers);
      
      setOriginalUsers([...originalUsers, newUserWithId]);
    } else {
      const updatedUsers = [...users, newUserWithId];
      setUsers(updatedUsers);
      setOriginalUsers(updatedUsers);
    }
    
    setNewUser({ id: '', name: '', department: '', role: '' });
    setIsModalOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target[0].value.toLowerCase();
    if (searchValue === '') {
      setUsers(originalUsers);
    } else {
      const searchResults = originalUsers.filter(user =>
        user.name.toLowerCase().includes(searchValue)
      );
      setUsers(searchResults);
    }
  };


  const handleSortToggle = () => {
    if (isSorted) {
      setUsers(originalUsers);
    } else {
      const sorted = [...users].sort((a, b) => a.name.localeCompare(b.name));
      setUsers(sorted);
    }
    setIsSorted(!isSorted);
  };
  
  return (
    <div id="userlist-body">
      <h1>Employees</h1>
      <div id="controls">
        <button className="sort-button" onClick={handleSortToggle}>
          Sort by Name
        </button>
        <form className="search-form" onSubmit={handleSearch}>
          <input type="text" placeholder="Search by name" />
          <button type="submit">Search</button>
        </form>
        <button className="reset-button" onClick={() => setUsers(originalUsers)}>Show List</button>
      </div>
      <div id="user-cards-container">
        <button className="add-employee-button" onClick={() => setIsModalOpen(true)}>
          <FaCirclePlus fontSize="2em" />
        </button>
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="user-card">
              <h3>{user.name}</h3>
              <p><strong>Department:</strong> {user.department}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          ))
        ) : (
          <div className="no-results-message">No match found</div>
        )}
      </div>
  
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
            <form className="add-new-employee-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newUser.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={newUser.department}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="role"
                placeholder="Role"
                value={newUser.role}
                onChange={handleChange}
                required
              />
              <button type="submit" className="add-employee-button-modal">
                Add Employee
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Userlist;