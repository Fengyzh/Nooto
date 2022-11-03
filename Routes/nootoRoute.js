const express = require('express')
const nootoRouter = express.Router()
const noo = require('../newNote')
const User = require('../User')
const mongoose = require('mongoose')
const Redis = require('redis')

const DEFAULT_EXPIRATION_TIME = 5000
let redisClient;

(async () => {
  redisClient = Redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
  console.log("Redis connected")
})();



nootoRouter.post('/', async (req, res) => {
    console.log("Requesting Nooto id:" + req.body.NootoID)
    console.log("owner: " + req.body.UID)
    
    let names = []
    let note

    try {
        cache = await redisClient.get(req.body.NootoID)
        if (cache) {
            note = JSON.parse(cache)
            console.log("fetching from redis")

        } else {
            note = await noo.findById({"_id": req.body.NootoID});
            console.log("fetching from db")
            await redisClient.setEx(String(req.body.NootoID), DEFAULT_EXPIRATION_TIME,JSON.stringify(note))
        }

        if (note.owner === req.body.UID || note.share.includes(req.body.UID)) {

                for (let i = 0; i < note.share.length; i++) {
                    let name = await User.findOne({"UID": note.share[i]}).populate("Name", "UID");
                    names.push(name)
                }

                //await redisClient.setEx(req.body.UID, DEFAULT_EXPIRATION_TIME, JSON.stringify(note))
                res.json({note, state:"Pass", shareNames:names})
            } else {
                res.json({state: "No Permission"})
            }
    } catch(err) {
        console.log(222)
        res.json({state: "Error"})
    }

    
})



nootoRouter.post('/save', async (req, res) => {

    console.log("save....")
    var ObjectId = mongoose.Types.ObjectId

    let note = new noo({
        title: req.body.title,
        values: req.body.values,
        lastModified: req.body.lastModified,
        share: req.body.share
    })

        note = await noo.findById({"_id": req.body.id});
        note.title = req.body.title
        note.values = req.body.values
        note.lastModified = req.body.lastModified
        note.share = req.body.share

    note.save().then(async data => {
        console.log(req.body.id)
        await redisClient.setEx(String(req.body.id), DEFAULT_EXPIRATION_TIME,JSON.stringify(note)).then(()=>
            res.json(data)
        )

    }).catch(err => {
        res.json("Error")
    })

})


nootoRouter.post("/newNooto", async (req,res)=>{
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


nootoRouter.post("/delete", async (req, res) => {
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



module.exports = nootoRouter