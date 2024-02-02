const express = require('express');
const fs= require('node:fs')
const bodyParser = require('body-parser');
const app = express();
const jsonData = require('./data/data.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    
    res.send("Server is running  <ul> <li>GET request :  /data </li>   <li>POST request : /data </li>    <li> UPDATE request : /data/id </li>  <li>DELETE request : /data/id </li>   </ul>");
})

app.get('/data',(req,res)=>{
    res.json(jsonData.data)
})

app.post('/data',(req,res)=>{
    let id=req.body.id || jsonData.data.length;
    let first_name=req.body.first_name || "";
    let last_name=req.body.last_name || "";
    const user={
        id:id,
        first_name:first_name,
        last_name:last_name,
    }
    jsonData.data.push(user)
    fs.writeFile("./data/data.json",JSON.stringify(jsonData),(err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log('Data is Posted');
        }
    });
    res.json(jsonData)
})

app.put('/data/:id',(req,res)=>{
    let index = jsonData.data.findIndex((e)=>{
        return (e.id === Number.parseInt(req.params.id))
    })

    let id=req.body.id || jsonData.data[index].id;
    let first_name=req.body.first_name || jsonData.data[index].first_name;
    let last_name=req.body.last_name || jsonData.data[index].last_name;
    if(index>=0)
    {
        jsonData.data[index].id=id;
        jsonData.data[index].first_name=first_name;
        jsonData.data[index].last_name=last_name;
        
        fs.writeFile("./data/data.json",JSON.stringify(jsonData),(err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log('Data is Updated');
            }
        });
        res.json(jsonData.data[index])
    }
    else{
        res.status(404)
        res.end()
    }
})

app.delete('/data/:id',(req,res)=>{
    let index = jsonData.data.findIndex((e)=>{
        return (e.id === Number.parseInt(req.params.id))
    })

    if(index>=0)
    {
        let obj= jsonData.data[index];
        jsonData.data.splice(index,1)
        fs.writeFile("./data/data.json",JSON.stringify(jsonData),(err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log('Data is deleted');
            }
        });
        res.json(obj)
    }
    else{
        res.status(404)
        res.end()
    }
})

app.listen(3000,()=>{
    console.log("Server is running at PORT : 3000");
})