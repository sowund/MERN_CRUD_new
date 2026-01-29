import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

const  API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  //State to store the value from database
  const [people,setpeople]=useState([]);
  const [form,setForm]=useState({name:"", age:""});
  const[editId,setEditId]=useState(null);

  //Read from database
  useEffect(()=>{
    loadpeople();
  },[]);
   
  const loadpeople = async()=>{
    const res= await axios.get(API);
    setpeople(res.data);
  };

  //Create person
  const addPerson =async()=>{
    if(!form.name ||!form.age)
      return alert("Please fill all fields");
    const res =await axios.post(API,{name:form.name, age: Number(form.age)});
    setpeople([...people,res.data]);
    setForm({name:"",age:""});
  }

  //Start Edit Function
  const startEdit=(p)=>{
    setEditId(p._id);
    setForm({name:p.name,age:p.age})
  };

  //Update Function
  const updatePerson= async()=>{
    const res= await axios.put(`${API}/${editId}`,form);
    setpeople(people.map(p=>(p._id===editId ? res.data:p)));
    setEditId(null);
    setForm({name:"",age:""});  
  };

  //Delete Function
  const deletePerson = async(id)=>{
    await axios.delete(`${API}/${id}`);
    setpeople(people.filter(p=> p._id!==id));
  }

  return (
    <div>
      <h3>MERN Stack CRUD-Application</h3>
      <input type='text' placeholder='Enter Name' value={form.name} onChange={e=> setForm({...form,name:e.target.value})}/>
      <input type='text' placeholder='Enter Age' value={form.age} onChange={e=> setForm({...form,age:e.target.value})}/>
      {editId?(
         <button onClick={updatePerson}>Update</button>
      ):(
         <button onClick={addPerson}>Add</button>
      )
      }
      <hr/>
      {people.map(p=>(
        <div key={p._id}>
          <b>{p.name}</b>-{p.age}
          <button onClick={()=> startEdit(p)}>Edit</button>
          <button onClick={()=> deletePerson(p._id)}>Delete</button>
        </div>
      ))}
      
    </div>
   
  );
}

export default App;
