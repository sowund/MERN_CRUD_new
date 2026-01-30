import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

function App() {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const[id,setId]=useState(null);

  //Read from database
  useEffect(() => {
    loadPeople();
  }, []);

  //Will load the datas which is currently in the setPeople state
  const loadPeople = async () => {
    const res = await axios.get(API);
    setPeople(res.data);
  }

  //To add new post
  const addPost = async () => {
    if (!name || !age) {
      alert("Enter both name and age");
      return;
    }
    const res = await axios.post(API, { name, age });
    setPeople([...people, res.data]);
    setName("");
    setAge(0);
  }

  // Edit functionality to be implemented
  const editPost = async (post) => {
    setId(post._id);
    setName(post.name);
    setAge(post.age);
  }

  //To update the person
  const updatePerson = async () => {
    const res = await axios.put(`${API}/${id}`, { name, age })
    setPeople(people.map(p => (p._id === id ? res.data : p)));
    setId(null);
    setName("");
    setAge(0);
  }

  //To delete a person
  const deletePost = async (id) => {
    await axios.delete(`${API}/${id}`);
    setPeople(people.filter(p=>p._id!==id));
    // await loadPeople();
  }

  const cancelEdit = () => {
    setId(null);
    setName("");
    setAge(0);
  }
  return (
    <div>
      <h3>MERN Stack CRUD-Application</h3>
      {people.map(p => (
          <div key={p._id}>
          <b>{p.name}</b> - {p.age} 
          <button onClick={() => editPost(p)}>Edit</button>
          <button onClick={() => deletePost(p._id)}>Delete</button>
            </div>
        ))}
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
      {
        id ?
          (
            <div>
              <button onClick={updatePerson}>Update</button>
              <button onClick={cancelEdit}>Cancel</button>
              </div>
          ) : (
            <button onClick={addPost}>Add Person</button>
         )
      }
        
    </div>
  );
}

export default App;