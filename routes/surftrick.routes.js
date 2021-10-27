const router = require("express").Router();
const Surftrick = require("../models/Surftrick.model")
const User = require("../models/User.model")
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");


router.get("/surftrickList", isLoggedIn, (req, res, next)=>{
    const userInSession = req.session.user 
    Surftrick.find()
    .populate("author")
    .then((surftricksFromDB)=>{
        const data = {
            surftricksArr:surftricksFromDB
        }

        console.log("data",{userInSession, data})
       res.render("surftricks/surftrick-list", {userInSession, data}) 
    })
    .catch((error)=>{
        console.log("Error getting list of surftricks from the DB", error);
        next(error)
    });
})

router.get("/surftrickList/create", isLoggedIn, (req, res, next) =>{
    res.render("surftricks/surftrick-create")
   
});


router.post("/surftrickList/create", isLoggedIn, (req, res, next) => {
    const {name, image, description, rateOfDifficulty} = req.body;
    //console.log("author", author)
    const author = req.user._id
    const newSurftrick = {
        name,
        image, 
        description, 
        rateOfDifficulty, 
        author

    }
    
    Surftrick.create(newSurftrick) 
       .then((newSurftrick) => {
        res.redirect("/surftrickList")
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

router.get("/surftrickList/:surftrickId/edit", isLoggedIn, (req, res, next)=>{
    Surftrick.findById(req.params.surftrickId)
    .then((surftrickFromDB)=>{
        res.render("surftricks/surftrick-edit", surftrickFromDB)
    })
    .catch((error)=>{
        console.log("Error getting destails for a single surftrick from DB", error);
        next(error)
    });
})

router.post("/surftrickList/:surftrickId/edit", isLoggedIn, (req, res, next)=>{
    const author = req.user._id 
    const {name, image, description, rateOfDifficulty} = req.body;
    const newTrick = {
        name,
        image,
        description, 
        rateOfDifficulty,
    };

    Surftrick.findById(req.params.surftrickId)
    .then((surftrickFromDB) => {
        console.log("surfTrickDB", surftrickFromDB)
        if(surftrickFromDB.author == req.user._id){
            Surftrick.findByIdAndUpdate(req.params.surftrickId, newTrick, {new: true})
            .then((surftrickFromDB)=>{
                res.redirect("/surftrickList/" + surftrickFromDB._id)
            })

        }else {
            res.render("surftricks/surftrick-list", { error: "Opps can not edit this trick!" })
        }
    })

    .catch((error)=>{
        console.log("Error updating details for a single surftrick ", error);
        next(error)
    });
})


router.post('/surftrickList/:surftrickId/delete', isLoggedIn,  (req, res, next) => {
    const author = req.user._id 
    
    Surftrick.findById(req.params.surftrickId)
        .then((surftrickFromDB)=>{

            if(surftrickFromDB.author == req.user._id) {
                Surftrick.findByIdAndRemove(req.params.surftrickId)
                .then(() =>{
                    res.redirect("/surftrickList")
                }) 
            }else {
                res.render("surftricks/surftrick-list", { error: "Opps you are not a creator!" })
            }

        })
        .catch((error)=>{
            console.log("Error deleating details for a single surftrick ", error);
        next(error)

        })
})









module.exports = router;