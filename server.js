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



/*
app.post('/save', async (req, res) => {

    console.log("save....")
    var ObjectId = mongoose.Types.ObjectId

    let note = new noo({
        title: req.body.title,
        values: req.body.values,
        lastModified: req.body.lastModified,
        share: req.body.share
    })


    //try {
        note = await noo.findById({"_id": req.body.id});
        note.title = req.body.title
        note.values = req.body.values
        note.lastModified = req.body.lastModified
        note.share = req.body.share

    note.save().then(data => {
        res.json(data)
    }).catch(err => {
        res.json("Error")
    })

})

*/

/*
app.get('/posts/:id', async (req, res) => {
    console.log("Requesting Nooto id:" + req.params.id)
    
    try {
        const note = await noo.findById({"_id": req.params.id});
        //console.log(note)
        res.json(note)
    } catch (err) {
        console.log(222)
        res.json("Error")
    }
})
*/
/*
app.post('/nooto', async (req, res) => {
    console.log("Requesting Nooto id:" + req.body.NootoID)
    console.log("owner: " + req.body.UID)
    
    let names = []

    try {
        const note = await noo.findById({"_id": req.body.NootoID});
        if (note.owner === req.body.UID || note.share.includes(req.body.UID)) {
            for (let i = 0; i < note.share.length; i++) {
                let name = await User.findOne({"UID": note.share[i]}).populate("Name", "UID");
                names.push(name)
            }


            res.json({note, state:"Pass", shareNames:names})
        } else {
            res.json({state: "No Permission"})
        }
        //console.log(note)
    } catch (err) {
        console.log(222)
        res.json({state: "Error"})
    }
})
*/


app.post('/userTest', (req,res) => {
    console.log("Saving User")

    console.log(req.body.Email)
    console.log(req.body.UID)

    
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
        const user = await User.findOne({"UID": req.params.uid});
        const available = await User.findOne({"UID": req.params.uid}).populate("Nooto", "title owner");

        let availableList = []

    try {
    for (let j = 0; j < available.Nooto.length; j++) {
        availableList.push(JSON.stringify(available.Nooto[j]._id).replace(/\"/g, ""))
        console.log(available.Nooto[j]._id)
    }
        //console.log(note)
        //res.json(note)
        for (let i = 0; i < user.Nooto.length; i++) {
            let note = user.Nooto[i]
            //console.log("Note" + note)
        }

        clearnNooto(user, user.Nooto, availableList)
        //console.log(available)
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
    console.log("Starting share delete")
    console.log(req.body)

    
    let note = await noo.findById({"_id": req.body.id});

    if (note) {
        note.share = req.body.share

        let names = []
        for (let i = 0; i < req.body.share.length; i++) {
            let name = await User.findOne({"UID": req.body.share[i]}).select("Name UID");
            names.push(name)
        }
            console.log("In delete update....")

            clearNootoOne(req.body.difference[0], req.body.id)
            note.save().then(() => {
                console.log("names: " + names)
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

        console.log("Updating Share Values")
        //console.log(req.body.share)
        //console.log("string: " + note.toString())
        let names = []
        for (let i = 0; i < req.body.share.length; i++) {
            let name = await User.findOne({"UID": req.body.share[i]}).select("Name UID");
            names.push(name)
        }

        let usr = await User.findOne({UID: req.body.difference})
        if (!usr){
            console.log("User not found, skipping")
            res.status(400)
            res.json({})
            return
        }

        let result = usr.Nooto.filter((value) => 
        {
        console.log(value.toString())
        return value.toString() == req.body.id
        }
                
    )
            
        console.log("Result array: " + result)

        if (result.length == 0) {
            console.log("adding to user: " + usr.UID)
            usr.Nooto.push(ObjectId(req.body.id))
            usr.save()
        }



/*
        for(let i = 0; i < note.share.length; i++) {
            console.log("inLoop Users: " + req.body.share[i])
            //console.log(ObjectId(req.body.id))

            usr = await User.findOne({UID: note.share[i]})
            if (!usr) {
                console.log("User Not Found, Skipping")
                res.status(400)
                res.json()
                return
            }

            console.log("Current user Nootos: " + usr.Nooto)
            console.log("body: " + req.body.id)

            if (usr) {

                let result = usr.Nooto.filter((value) => 
                    {
                    console.log(value.toString())
                    return value.toString() == req.body.id
                    }
                            
                )
                
                console.log("Result array: " + result)

                if (result.length == 0) {
                    console.log("adding to user: " + usr.UID)
                    usr.Nooto.push(ObjectId(req.body.id))
                    usr.save()
                }
            }
    } */

    
        
        note.save().then(() => {
            console.log("names: " + names)
            res.status(200)
            res.json({share: note.share, shareNames: names})
        })
    
    } else {
        res.status(400)
        res.json()
    }


})



app.delete('/users/:uid', async (req,res) => {
    console.log(req.params.id)
    const user = await User.findOne({"UID": req.params.uid}).deleteOne();
    console.log(user)

    await noo.deleteMany({ "owner": req.params.uid })
    console.log("Deleted User and Nooto")
    res.json({state: "Success"})
})




// ----- Util Function ----- //





async function clearNootoOne (userID, NootoID) {
    const user = await User.findOne({"UID": userID});
    //console.log("USER: " + user)

    let index = 0
    for (let j = 0; j < user.Nooto.length; j++) {
        let processedString = JSON.stringify(user.Nooto[j]._id).replace(/\"/g, "")
        console.log(processedString + " : " + NootoID)
        if (NootoID === processedString) {
            index = user.Nooto.indexOf(processedString)
            user.Nooto.splice(index, 1)

        }
    }
    console.log(user.Nooto)

    user.save()



    //let removed = user.Nooto.splice(indexList[i] - diff,1)
    //user.save()

}





function clearnNooto(user, fullList, availableList) {
    // fullList is the current list
    // AvailableList is what is current availabe after popluate

    const difference = fullList.filter(item => !availableList.includes(JSON.stringify(item).replace(/\"/g, "")))
    const indexList = []
    for (let j = 0; j < difference.length; j++) {
        indexList.push(fullList.indexOf(difference[j]))
     }
     console.log(difference)
     console.log(indexList)

    let diff = 0
    for (let i = 0; i < indexList.length; i++) {

            let removed = user.Nooto.splice(indexList[i] - diff,1)
            console.log("list: "+ user.Nooto)
            console.log("removed: " + removed)
            diff += 1
    }
    user.save()
    
}



/*
app.post("/nooto/newNooto", async (req,res)=>{
    let date = new Date().toLocaleString()

    let note = new noo({
        title: "New Nooto",
        lastModified: date,
        createdDate: date,
        owner: req.body.UID,
        share: [],
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
*/

/*
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

})
*/

mongoose.connect(PROCESS.ENV.MONGO, () => {
    console.log("Conncted To Mongo")
});


// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// test