const express = require('express')
const nootoRouter = express.Router()
const noo = require('../newNote')
const User = require('../User')


nootoRouter.post('/', async (req, res) => {
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


module.exports = nootoRouter