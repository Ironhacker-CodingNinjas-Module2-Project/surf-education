const router = require("express").Router();
const Surftrick = require("../models/Surftrick.model");
const User = require("../models/User.model");
const fileUploader = require('../config/cloudinary.config');
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");


router.get("/surftrickList", isLoggedIn, (req, res, next)=>{
    const userInSession = req.session.user 
    Surftrick.find()
    .populate("author")
    .then((surftricksFromDB)=> {
        const data = {
            surftricksArr:surftricksFromDB
        }
       res.render("surftricks/surftrick-list", {userInSession, data}) 
    })
    .catch((error)=> {
        console.log("Error getting list of surftricks from the DB", error);
        next(error)
    })
});

router.get("/surftrickList/create", isLoggedIn, (req, res, next) =>{
    res.render("surftricks/surftrick-create")
});

router.post("/surftrickList/create", fileUploader.single('image'), isLoggedIn, (req, res, next) => {
    const { name, description, rateOfDifficulty } = req.body;
    const author = req.user._id;
    const image = req.file.path;
    
    Surftrick.create({name, image, description, rateOfDifficulty, author}) 
       .then((newSurfTrickFromDB) => {
           console.log("Info from DB",newSurfTrickFromDB )
        res.redirect("/surftrickList")
    })
    .catch((error)=>{
        console.log("Error displaying new surftricks", error);
        next(error)
    })
});

router.get("/surftrickList/:surftrickId", isLoggedIn, (req, res, next)=>{
    Surftrick.findById(req.params.surftrickId)
    .then((surftrickFromDB)=>{
        let isOwner;
        if (surftrickFromDB.author == req.user._id) {
            isOwner = true;
        } else {
            isOwner = false;
        }
        res.render("surftricks/surftrick-detail", {isOwner,surftrickFromDB})
    })
    .catch((error)=>{
        console.log("Error getting details for a single surftrick from DB", error);
        next(error)
    })
});

router.get("/surftrickList/:surftrickId/edit", isLoggedIn, (req, res, next)=>{
    Surftrick.findById(req.params.surftrickId)
    .then((surftrickFromDB)=>{
        res.render("surftricks/surftrick-edit", surftrickFromDB)
    })
    .catch((error)=>{
        console.log("Error getting destails for a single surftrick from DB", error);
        next(error)
    });
});

router.post("/surftrickList/:surftrickId/edit", isLoggedIn, fileUploader.single('image'), (req, res, next) => {
    const author = req.user._id
    const { name, existingImage, description, rateOfDifficulty } = req.body;
    let image;
    if (req.file) {
        image = req.file.path;
        console.log("is this the image", image)
    } else {
        image = existingImage;
    }
    const newTrick = {
        name,
        image,
        description,
        rateOfDifficulty,
    };
    Surftrick.findById(req.params.surftrickId)
        .then((surftrickFromDB) => {
            if (surftrickFromDB.author == req.user._id) {
                Surftrick.findByIdAndUpdate(req.params.surftrickId, newTrick, { new: true })
                    .then((surftrickFromDB) => {
                        let isOwner;
                        if (surftrickFromDB.author == req.user._id) {
                            isOwner = true;
                        } else {
                            isOwner = false;
                        }
                        res.redirect("/surftrickList");
                    })
            }
        })
        .catch((error) => {
            console.log("Error updating details for a single surftrick ", error);
            next(error)
        })
});


router.post('/surftrickList/:surftrickId/delete', isLoggedIn,  (req, res, next) => { 
    Surftrick.findById(req.params.surftrickId)
        .then((surftrickFromDB)=>{
            let isOwner;
            if(surftrickFromDB.author == req.user._id){
                isOwner = true;
            } else {
                isOwner = false;
            }
            res.render("surftricks/surftrick-list")
        })
        .catch((error)=>{
            console.log("Error deleating details for a single surftrick ", error);
        next(error)
    })
});





module.exports = router;