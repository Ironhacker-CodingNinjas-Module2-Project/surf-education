const router = require("express").Router();
const Surftrick = require("../models/Surftrick.model")

router.get("/surftrickList", (req, res, next)=>{
    Surftrick.find()
    .then((surftricksFromDB)=>{
        const data = {
            surftricksArr:surftricksFromDB
        }
       res.render("surftricks/surftrick-list", data) 
    })
    .catch((error)=>{
        console.log("Error getting list of surftricks from the DB", error);
        next(error)
    });
})

router.get("/surftrickList/create", (req, res, next) =>{
    Surftrick.find()
    .then((allSurftricks)=>{
        // res.send("hello World")
        res.render("surftricks/surftrick-create", {surftricksArr: allSurftricks})
    })
    .catch((error)=>{
        console.log("Error getting surftricks from the DB", error);
        next(error)
    });
});


router.post("/surftrickList/create", (req, res, next) => {
    const {name, image, description, rateOfDifficulty} = req.body;


    
    //console.log(req.session.user)
    // const currentUserId = 


    Surftrick.create({name, image, description, rateOfDifficulty, author})
    .then((trickFromDB) => {
        console.log("the trick was created");
        console.log(trickFromDB);
        //res.redirect("/surftrickList")
    })

    .catch((error)=>{
        console.log("Error displaying new surftricks", error);
        next(error)
    });
});

router.get("/surftrickList/:surftrickId", (req, res, next)=>{
    Surftrick.findById(req.params.surftrickId)
    .then((surftricksFromDB)=>{
        res.render("surftricks/surftrick-detail", surftricksFromDB)
    })
    .catch((error)=>{
        console.log("Error getting details for a single surftrick from DB", error);
        next(error)
    });
})

router.get("/surftrickList/:surftrickId/edit", (req, res, next)=>{
    Surftrick.findById(req.params.surftrickId)
    .then((surftrickFromDB)=>{
        console.log(surftrickFromDB)
        res.render("surftricks/surftrick-edit", surftrickFromDB)
    })
    .catch((error)=>{
        console.log("Error getting destails for a single surftrick from DB", error);
        next(error)
    });
})

router.post("/surftrickList/:surftrickId/edit", (req, res, next)=>{
    const {name, image, description, rateOfDifficulty} = req.body;
    const newTrick = {
        name,
        image,
        description, 
        rateOfDifficulty
    };
    Surftrick.findByIdAndUpdate(req.params.surftrickId, newTrick, {new: true})
    .then((surftrickFromDB)=>{
        res.redirect("/surftrickList/" + surftrickFromDB._id)
    })
    .catch((error)=>{
        console.log("Error updating details for a single surftrick ", error);
        next(error)
    });
})


module.exports = router;