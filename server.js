const express = require('express'); 
const cors = require("cors");
const mongoose = require('mongoose')
const noo = require('./newNote')
const User = require('./User')
var ObjectId = require('mongodb').ObjectId;
const nootoRouter = require("./Routes/nootoRoute")


const app = express(); 
const port = 4000; 

// This is in main

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/nooto", nootoRouter)


app.post('/userTest', (req,res) => {

    
        let user = new User({
            Email: req.body.Email,
            UID: req.body.UID,
            Name: req.body.Name,
            Nooto: []
        })

        user.save()
    res.json("user created")
        
})


app.get("/userTest/:id", async (req, res)=>{

    try {
        const user = await User.findOne({"UID": req.params.id});

        res.json(user)
    } catch (err) {
       res.error(err)
    }


})


app.get("/user/getnooto/:uid", async (req, res) => {
        const user = await User.findOne({"UID": req.params.uid});
        const available = await User.findOne({"UID": req.params.uid}).populate("Nooto", "title owner");

        let availableList = []

    try {
    for (let j = 0; j < available.Nooto.length; j++) {
        availableList.push(JSON.stringify(available.Nooto[j]._id).replace(/\"/g, ""))
    }
        for (let i = 0; i < user.Nooto.length; i++) {
            let note = user.Nooto[i]
        }

        clearnNooto(user, user.Nooto, availableList)
        res.json(available)
    } catch {
        res.status(404)
        res.send("ERROR in getting User Nooto in profile")
    }

})


app.post('/user/name', async (req, res) => {
    const user = await User.findOne({"UID":req.body.uid})
    if (user) {
        user.Name = req.body.newName
        user.save()
        res.status(200)
        res.send("OK")
    } else {
        res.send("User not found")
    }
})


app.post('/share/delete', async (req, res) => {

    
    let note = await noo.findById({"_id": req.body.id});

    if (note) {
        note.share = req.body.share

        let names = []
        for (let i = 0; i < req.body.share.length; i++) {
            let name = await User.findOne({"UID": req.body.share[i]}).select("Name UID");
            names.push(name)
        }

            clearNootoOne(req.body.difference[0], req.body.id)
            note.save().then(() => {
                res.json({share:note.share, shareNames: names})
                
            })
        
    } else {
        res.status(400)
    }
    
})



app.post('/updateshare', async (req,res) => {

    let note = await noo.findById({"_id": req.body.id});

    if (note) {
        note.share = req.body.share

        let names = []
        for (let i = 0; i < req.body.share.length; i++) {
            let name = await User.findOne({"UID": req.body.share[i]}).select("Name UID");
            names.push(name)
        }

        let usr = await User.findOne({UID: req.body.difference})
        if (!usr){
            res.status(400)
            res.json({})
            return
        }

        let result = usr.Nooto.filter((value) => 
        {
        return value.toString() == req.body.id
        }
                
    )
            
        if (result.length == 0) {
            usr.Nooto.push(ObjectId(req.body.id))
            usr.save()
        }

    
        
        note.save().then(() => {
            res.status(200)
            res.json({share: note.share, shareNames: names})
        })
    
    } else {
        res.status(400)
        res.json()
    }


})



app.delete('/users/:uid', async (req,res) => {
    const user = await User.findOne({"UID": req.params.uid}).deleteOne();

    await noo.deleteMany({ "owner": req.params.uid })
    res.json({state: "Success"})
})




// ----- Util Function ----- //





async function clearNootoOne (userID, NootoID) {
    const user = await User.findOne({"UID": userID});

    let index = 0
    for (let j = 0; j < user.Nooto.length; j++) {
        let processedString = JSON.stringify(user.Nooto[j]._id).replace(/\"/g, "")
        if (NootoID === processedString) {
            index = user.Nooto.indexOf(processedString)
            user.Nooto.splice(index, 1)

        }
    }

    user.save()


}





function clearnNooto(user, fullList, availableList) {
    // fullList is the current list
    // AvailableList is what is current availabe after popluate

    const difference = fullList.filter(item => !availableList.includes(JSON.stringify(item).replace(/\"/g, "")))
    const indexList = []
    for (let j = 0; j < difference.length; j++) {
        indexList.push(fullList.indexOf(difference[j]))
     }


    let diff = 0
    for (let i = 0; i < indexList.length; i++) {

            let removed = user.Nooto.splice(indexList[i] - diff,1)

            diff += 1
    }
    user.save()
    
}



mongoose.connect(PROCESS.ENV.MONGO, () => {
    console.log("Conncted To Mongo")
});


app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

