const express=require ('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
const mysql=require('mysql2');

const db=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'mahesh.27798',
    database:'test'
})

//Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/api/get',(req,res)=>{
    const sqlGet='SELECT * FROM employee';
    db.query(sqlGet,(err,result)=>{
        if(err){
            console.log("Error:- ",err);
            res.status(500).json({error:'Fail to fetch data.'})
        }
        res.send(result);
    })
})

app.post('/api/post',(req,res)=>{
    const {firstName,lastName,salary,city}=req.body;
    const sqlPost="INSERT INTO employee (firstName,lastName,salary,city) VALUES (?,?,?,?)";
    db.query(sqlPost,[firstName,lastName,salary,city],(err,result)=>{
        if(err){
            console.log('Error:-',err);
            res.status(500).json({error:'Fail to insert data.'})
        }

        res.status(200).json({message:'Successfully Insert Added Data.'})
    })
})

app.delete('/api/remove/:id',(req,res)=>{
    const {id}=req.params;
    const sqlDelete="Delete from employee where id=?";
    db.query(sqlDelete,id,(err,result)=>{
        if(err){
            console.log("Error:- ",err);
            res.status(200).json({error:'Fail To Delete Data.'})
        }
        res.status(200).json({message:'Successfully Delete Data.'})
    })
})

app.put('/api/update/:id',(req,res)=>{
    const {id}=req.params;
    const {firstName,lastName,salary,city}=req.body;
    const sqlUpdate='UPDATE employee SET firstName=? , lastName=? , salary=? ,city=? WHERE id=?';
    db.query(sqlUpdate,[firstName,lastName,salary,city,id],(err,result)=>{
        if(err){
            console.log("Error:- ",err);
            res.status(500).json({error:'Fail to update data.'})
        }
        res.status(200).json({message:'Successfully Update Data.'})
    })
})

app.get('/api/get/:id',(req,res)=>{
    const {id}=req.params;
    const getData="SELECT * FROM employee WHERE id=?";
    db.query(getData,id,(err,result)=>{
        if(err){
            console.log("Error:- ",err);
            res.status(500).json({error:'Fail To Fetch Data.'})
        }
        res.send(result);
    })
})

//To search by firstName and lastName
app.get('/api/search', (req, res) => {
    const { firstName, lastName } = req.query;
    const sqlSearch = 'SELECT * FROM employee WHERE firstName LIKE ? OR lastName LIKE ?';
    db.query(sqlSearch, [`%${firstName}%`, `%${lastName}%`], (err, result) => {
        if (err) {
            console.log("Error:- ", err);
            res.status(500).json({ error: 'Fail to fetch data.' })
        }
        res.send(result);
    });
});

//To sort in ascending or descending order

app.get('/api/sort', (req, res) => {
    const { sortField, sortOrder } = req.query;
    if (!sortField || !sortOrder) {
        return res.status(400).json({ error: 'Invalid sorting parameters.' });
    }

    const sqlSort = `SELECT * FROM employee ORDER BY ${sortField} ${sortOrder}`;

    db.query(sqlSort, (err, result) => {
        if (err) {
            console.log("Error:- ", err);
            res.status(500).json({ error: 'Fail to sort data.' });
        }
        res.send(result);
    });
});




app.listen(3001,()=>{
    console.log("Backend Server Started at PORT:- 3001");
})