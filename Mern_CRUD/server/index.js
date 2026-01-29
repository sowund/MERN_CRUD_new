require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));
    
//Define a schema and model
const Person = mongoose.model("Person", { name: String, age: Number },"person");

//Read all the people
app.get('/', async (req, res) => {
    const people = await Person.find();
    res.json(people);
});

//Add new people
app.post("/",async(req,res)=>{
    const newPerson= await  Person.create(req.body);
    res.json(newPerson);
});

//Update people
app.put("/:id",async(req,res)=>{
    const updated= await Person.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.json(updated);
});
//Delete people
app.delete("/:id",async(req,res)=>{
    await Person.findByIdAndDelete(req.params.id);
    res.json({message:"Person deleted"});
});

const PORT =process.env.PORT || 50000;
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:5000");
})