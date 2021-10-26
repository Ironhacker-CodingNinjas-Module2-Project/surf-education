const router = require("express").Router();
const Surftrick = require("../models/Surftrick.model")
const User = require("../models/User.model")
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/surftrickList", isLoggedIn, (req, res, next) => {
    const userInSession = req.session.user
    Surftrick.find()
        .populate("author")
        .then((surftricksFromDB) => {
            const data = {
                surftricksArr: surftricksFromDB
            }
            res.render("surftricks/surftrick-list", { userInSession, data })
        })
        .catch((error) => {
            console.log("Error getting list of surftricks from the DB", error);
            next(error)
        });
})

router.get("/surftrickList/create", isLoggedIn, (req, res, next) => {
    res.render("surftricks/surftrick-create")
});


router.post("/surftrickList/create", isLoggedIn, (req, res, next) => {
    const { name, image, description, rateOfDifficulty } = req.body;
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
        .catch((error) => {
            console.log("Error displaying new surftricks", error);
            next(error)
        });
});


router.get("/surftrickList/:surftrickId", isLoggedIn, (req, res, next) => {
    // const userInSession = req.session.user
    Surftrick.findById(req.params.surftrickId)
        .populate("author")
        .then((surftricksFromDB) => {
            res.render("surftricks/surftrick-detail", surftricksFromDB)
        })
        .catch((error) => {
            console.log("Error getting details for a single surftrick from DB", error);
            next(error)
        });
})

router.get("/surftrickList/:surftrickId/edit", isLoggedIn, (req, res, next) => {
    Surftrick.findById(req.params.surftrickId)
        .then((surftrickFromDB) => {
            console.log(surftrickFromDB)
            res.render("surftricks/surftrick-edit", surftrickFromDB)
        })
        .catch((error) => {
            console.log("Error getting destails for a single surftrick from DB", error);
            next(error)
        });
})

router.post("/surftrickList/:surftrickId/edit", (req, res, next) => {
    const { name, image, description, rateOfDifficulty } = req.body;
    const newTrick = {
        name,
        image,
        description,
        rateOfDifficulty
    };
    Surftrick.findByIdAndUpdate(req.params.surftrickId, newTrick, { new: true })
        .then((surftrickFromDB) => {
            res.redirect("/surftrickList/" + surftrickFromDB._id)
        })
        .catch((error) => {
            console.log("Error updating details for a single surftrick ", error);
            next(error)
        });
})

router.post('/surftrickList/:surftrickId/delete', isLoggedIn, (req, res, next) => {
    // const userInSession = req.session.user
    const author = req.user._id
    Surftrick.findByIdAndRemove(req.params.surftrickId)
    console.log(req.params.surftrickId, "what is inside")
    if (!req.user._id) {
        return res.status(400).render("auth/signup", {
            errorMessage: "Please provide your username."
        });
    } 
    .then(() => {
        res.redirect("/surftrickList")
    })
        .catch((error) => {
            console.log("Error deleting surftrick!!", error);
            next(error)
        });
})


module.exports = router;