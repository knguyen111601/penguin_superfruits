///////////////////////////////////////////////////////
// Import dependencies 
///////////////////////////////////////////////////////
const express = require("express"); // express for router
const Fruit = require("../models/fruit") // fruit model 

///////////////////////////////////////////////////////
// Create Router
///////////////////////////////////////////////////////
const router = express.Router();

/////////////////////////////////
// Router Middleware
/////////////////////////////////

// middleware to check if user is logged in
router.use((req, res, next) => {
    // check if logged in
    if (req.session.loggedIn){
        // send to routes
        next()
    } else {
        res.redirect("/user/login")
    }
})

///////////////////////////////////////////////////////
// Routes
///////////////////////////////////////////////////////

////////////////////////////
// Fruits Routes
////////////////////////////

// seed route - seed our starter data
router.get("/seed", (req,res)=>{
    // array of starter fruits
    const startFruits = [
        { name: "Orange", color: "orange", readyToEat: false },
        { name: "Grape", color: "purple", readyToEat: false },
        { name: "Banana", color: "orange", readyToEat: false },
        { name: "Strawberry", color: "red", readyToEat: false },
        { name: "Coconut", color: "brown", readyToEat: false },
      ];
    // delete all fruits
    Fruit.deleteMany({})
    .then((data)=>{
        // seed the starter fruits
        Fruit.create(startFruits)
        // send created fruits back as json
        .then((data)=>{res.json({data})})
    })
})

// index route  - get - /fruits
// index route - get - /fruits
router.get("/", (req, res) => {
    //find all the fruits
    Fruit.find({username: req.session.username})
    .then((fruits) => {
        // render the index template with the fruits
        res.render("fruits/index.liquid", {fruits})
    })
    // error handling
    .catch((error) => {
        res.json({error})
    })
})

// New route - get - /fruits/new
router.get("/new", (req,res)=>{
    res.render("fruits/new.liquid")
})

// create - post request - /fruits
router.post("/", (req, res) => {

    // convert the checkbox property to true or false
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false

    // add the username to req.body, to track user
    req.body.username = req.session.username

    // create the new fruit
    Fruit.create(req.body)
    .then((fruit) => {
        // redirect the user back to the index route
        res.redirect("/fruits")
    })
    // error handling
    .catch((error) => {
        res.json({error})
    })

})

// Edit Route - get - /fruits/:id/edit
router.get("/:id/edit", (req,res)=>{
    const id = req.params.id
    Fruit.findById(id)
    .then((fruit)=>{
        // render the edit page template with the fruit data
        res.render("fruits/edit.liquid", {fruit})
    })
    .catch("error", (error)=>{res.json({error})})
})

// update route - put request - "/fruits/:id"
router.put("/:id", (req, res) => {
    // get the id from params
    const id = req.params.id
    
    // convert the checkbox property to true or false
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false

    // update the item with the matching id
    Fruit.findByIdAndUpdate(id, req.body, {new: true})
    .then((fruit) => {
        // redirect user back to index
        res.redirect("/fruits")
    })
     // error handling
    .catch((error) => {
        res.json({error})
    })
})

// Destroy route - delete request - /fruits/:id
router.delete("/:id", (req,res)=>{
    const id = req.params.id
    Fruit.findByIdAndRemove(id)
    .then((fruit)=>{
        res.redirect("/fruits")
    })
    // error handling
    .catch((error) => {
        res.json({error})
    })
})

// show route - get - /fruits/:id (show route always at the bottom)
router.get("/:id", (req, res) => {
    // get the id from params
    const id = req.params.id
    // get that particular fruit from the database
    Fruit.findById(id)
    .then((fruit) => {
        // render the show template with the fruit
        res.render("fruits/show.liquid", {fruit}) //fruit is from the promise
    })
     // error handling
    .catch((error) => {
        res.json({error})
    })
})

///////////////////////////////////////////////////////
// Export the Router
///////////////////////////////////////////////////////

module.exports = router;