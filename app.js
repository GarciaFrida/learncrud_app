const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const connect = require('./config')
const db = pgp(connect);
const port = 5005
const path = require('path');

app.use(express.urlencoded({extended:true}))


app.get("/task", async (req,res)=>{
    const data = await db.any('SELECT * FROM tasks')
    res.json(data)
})

app.get("/newtask", (req,res)=>{
    res.sendFile(__dirname + path.join("/html/newtask.html"))
})


app.post("/newtask", async ( req, res)=>{
    if(!req.body.title) return res.send('You must supply a title')
    let result = await db.none(`INSERT INTO tasks (title) VALUES ('${req.body.title}') RETURNINg id,title`)
    res.send(result)
})

app.patch('/edit-task/:id/complete_task', async (req,res)=>{
    let result = await db.one(`
        UPDATE tasks 
        SET is_completed = 'true' 
        WHERE id ='${req.params.id} RETURNING *`
    );
    res.send(result);

})
app.patch('/edit-task/:id/un_complete_task',)

app.listen(port, ()=>{
    console.log(`http://localhost${port}`)

})

// db.any('SELECT * FROM tasks')
// .then(data=>console.log(data));


