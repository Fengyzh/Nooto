const express = require('express'); 
const cors = require("cors");
var session = require('express-session');
const mongoose = require('mongoose')
const notes = require('./notes')
const noo = require('./newNote')
const User = require('./User')
var ObjectId = require('mongodb').ObjectId;


const app = express(); 
const port = 4000; 

// This is in main

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(session( {
    secret: "Secret",
    resave: false,
    saveUninitialized: true
}))


function check(req, res, next) {
    console.log(req.session)
    next()
}

// create a GET route
app.get('/title', (req, res) => { //Line 9

console.log("yes")
res.json({text:"Hello"})

}); //Line 11


app.get("/", (req, res) => {

    if (req.session.auth) {
    res.writeHead(302, {
        Location: 'http://localhost:3000/profile'
    });
    res.end();
}
 else{
     res.send("Invalid")
 }

});



// create a POST route
app.post('/login', (req, res) => {

    console.log("post requested")
    //console.log(req.body)

    if (req.body.username) {
        req.session.username = req.body.username
    }
    if (req.body.password == "123") {
        req.session.auth = true
    } else {
        req.session.auth = false
    }

    res.json({auth:req.session.auth})
    

   
});


app.get('/auth', (req, res) => {

    //console.log(req.session)
    if (req.session.auth == true) {
        res.json({auth:true, name:req.session.username})
    } else {
        //console.log("not auth")
        res.json({auth:false, name:req.session.username})
    }


})

app.get('/logout', (req, res) => {

    console.log("logout")
   req.session.auth = false;
    res.json({auth:false})

})

app.post('/save', async (req, res) => {

    console.log("save....")
    //console.log(req.body.values)
    /*
    let note = new notes({
        values: req.body.values
    });
    */

    let note = new noo({
        title: req.body.title,
        values: req.body.values
    })
/*
    try {
        note = await notes.findById({"_id": req.body.id});
        note.values = req.body.values
    } catch {
        console.log("new note")
    }*/

    try {
        note = await noo.findById({"_id": req.body.id});
        note.title = req.body.title
        note.values = req.body.values
    }catch{
        console.log("new note")
    }

    /*
    const noteSave = new notes({
        values: req.body.values
    });
*/
    note.save().then(data => {
        res.json(data)
    }).catch(err => {
        res.json("Error")
    })

})

app.get('/posts/:id', async (req, res) => {
    console.log("Requesting Nooto id:" + req.params.id)
    
    try {
        const note = await noo.findById({"_id": req.params.id});
        //console.log(note)
        res.json(note)
    } catch (err) {
        res.json("Cannot find note")
    }
})

app.post('/userTest', (req,res) => {
    console.log("Saving User")

    console.log(req.body.Email)
    console.log(req.body.UID)

    
        let user = new User({
            Email: req.body.Email,
            UID: req.body.UID,
            Nooto: []
        })

        user.save()
    res.json("user created")
        
})


app.get("/userTest/:id", async (req, res)=>{

    try {
        //const user = await User.findById({"_id": req.params.id}).populate("Nooto");
        const user = await User.findOne({"UID": req.params.id});

        //console.log(note)
        //res.json(note)
        //console.log(user)
        res.json(user)
    } catch (err) {
        //res.json("Cannot find note")
        console.log("err")
    }


})


app.get("/user/getnooto/:uid", async (req, res) => {
    try {
        const user = await User.findOne({"UID": req.params.uid}).populate("Nooto", "title");
        //console.log(note)
        //res.json(note)
        //console.log(user)
        res.json(user)
    } catch (err) {
        //res.json("Cannot find note")
        console.log("err in getting Nooto")
    }
})


app.post("/nooto/newNooto", async (req,res)=>{
    let date = new Date().toLocaleString()

    let note = new noo({
        title: "New Nooto",
        lastModified: date,
        createdDate: date,
        values:[{
            title: "New Section",
            value: [{
                text: "good",
            },
            {
                text: "bye",
            }
                    ],

        }]
    })

    console.log("Creating new note")
    const user = await User.findOne({"UID": req.body.UID});


    note.save().then(data => {
        console.log("Nooto created and saved")
        return data
    }).then((data)=>{
        user.Nooto.push(note)
        user.save()
        console.log(data._id)
        res.json(data._id)
    }).catch(err => {
        res.json("Error in creating new Nooto")
    })

    


})


app.post("/deleteNooto", async (req, res) => {
    //try {
    await noo.findById({"_id": req.body.id}).deleteOne();
    //const nootoDelete = await noo.findById({"_id": req.body.id})
    //nootoDelete.deleteOne();
    console.log("req id: " + req.body.id)
    const user = await User.findOne({"UID": req.body.UID})
    for (let i = 0; i < user.Nooto.length; i++) {
        let note = user.Nooto[i]
        console.log("item " + i + JSON.stringify(note).replace("\"", ""))
        if (req.body.id == JSON.stringify(note).replace(/\"/g, "")) {
            console.log(111)
            let removed = user.Nooto.splice(i,1)
            console.log("list: "+ user.Nooto)
            console.log("removed: " + removed)
        }
    }
    user.save()


    //console.log(req.body.UID)
    //user.Nooto = user.Nooto.filter(item => item._id !== req.body.id)
    //console.log(user)
    console.log("UID: " + req.body.UID)
    //await User.updateOne({ "UID": req.body.UID }, {"$pull" : { Nooto : {"_id": req.body.id} }})

    console.log("Nooto Deleted, ID: " + req.body.id)
    res.json("Nooto Deleted")
    /*
    } catch {
        console.log("Unable to delete Nooto")
    }*/
})


mongoose.connect('mongodb+srv://Feng:Feng1293875db@cluster0.odbkl.mongodb.net/Nooto?retryWrites=true&w=majority', () => {
    console.log("Conncted To Mongo")
});


// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6
