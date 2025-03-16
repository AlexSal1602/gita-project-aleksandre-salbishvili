import { useState, useEffect } from 'react';
import './Userlist.css';

const Userlist = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ id: '', name: '', department: '', role: '' });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/users.json');
        const data = await response.json();
        const finalUsers = data.map((user, index) => ({ id: index + 1, ...user }));
        setUsers(finalUsers);
        localStorage.setItem('users', JSON.stringify(finalUsers));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    const savedUsers = localStorage.getItem('users');
    if (savedUsers && JSON.parse(savedUsers).length > 0) {
      setUsers(JSON.parse(savedUsers));
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
    setUsers([...users, { ...newUser, id: users.length + 1 }]);
    setNewUser({ id: '', name: '', department: '', role: '' });
  };

  return (
    <>
      <h1>Home</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Add Employee</button>
      </form>
      <table id='table-users'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.department}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Userlist;