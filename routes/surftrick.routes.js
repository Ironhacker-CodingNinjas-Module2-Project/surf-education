const router = require("express").Router();
const Surftrick = require("../models/Surftrick.model")

router.get("/surftrickList/create", (req, res, next) =>{
    Surftrick.find()
    .then((allSurftricks)=>{
        res.send("hello World")
        // res.render("surftricks/surftrick-create", {surftricksArr: allSurftricks})
    })
    .catch((error)=>{
        console.log("Error getting surftricks from the DB", error);
        next(error)
    });
});


module.exports = router;