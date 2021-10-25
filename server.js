////////////////////////////////////////////////////////////////////////
// Import Our Dependencies
////////////////////////////////////////////////////////////////////////
require("dotenv").config(); // brings in dotenv vars
const express = require("express"); // web framework
const morgan = require("morgan"); // logger
const methodOverride = require("method-override"); // swap request methods
const mongoose = require("mongoose"); // our database library 
const path = require("path") // helper function for file paths 

////////////////////////////////////////////////////////////////////////
// Database Connection
////////////////////////////////////////////////////////////////////////
const DATABASE_URL= process.env.DATABASE_URL; // url from env 
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Connect to Mongo
mongoose.connect(DATABASE_URL, CONFIG);

// Events for when connection open/disconnects/errors
mongoose.connection
.on("open", ()=>{console.log("Connected to Mongoose")})
.on("close", ()=>{console.log("Disconnected from Mongoose")})
.on("error", (error)=>{console.log(error)});

////////////////////////////////////////////////////////////////////////
// Create our Fruits Model
////////////////////////////////////////////////////////////////////////
// destructuring schema and model from mongoose 
const {Schema, model} = mongoose; 

// Make a fruits schema
const fruitSchema = new Schema({
    name: String,
    color: String,
    readyToEat: Boolean
});

// Make the Fruit Model (first param is name of model and second is schema)
const Fruit = model("Fruit", fruitSchema)

// Log the model to make sure it exists
// console.log(Fruit)

////////////////////////////////////////////////////////////////////////
// Create our app with object, configure with liquid
////////////////////////////////////////////////////////////////////////
// Import liquid
const liquid = require("liquid-express-views");
const { RSA_NO_PADDING } = require("constants");
// Construct an absolute path to our views folder 
const viewsFolder = path.resolve(__dirname, "views/")

// log to see result value of viewsFolder
// console.log(viewsFolder)

// create an app object with liquid, passing the path to the views folder
const app = liquid(express(), {root: viewsFolder})

// console.log app to confirm it exists
// console.log(app)

////////////////////////////////////////////////////////////////////////
// Register Middleware
////////////////////////////////////////////////////////////////////////
// logging
app.use(morgan("tiny"));
// override request methods
app.use(methodOverride("_method"));
// ability to parse urlEncoded from form submissions
app.use(express.urlencoded({extended: true}))
// setup our public folder to server files statically
app.use(express.static("public"));


////////////////////////////////////////////////////////////////////////
// Routes
////////////////////////////////////////////////////////////////////////
app.get("/", (req, res)=>{
    res.send("Your server is running... better catch it")
});

////////////////////////////
// Fruits Routes
////////////////////////////

// seed route - seed our starter data
app.get("/fruits/seed", (req,res)=>{
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
app.get("/fruits", (req, res)=>{
    // find all the fruits
    Fruit.find({})
    .then((fruits)=>{
        // render the index template with the fruits
        res.render("fruits/index.liquid", {fruits: fruits})
    })
    // error handling
    .catch((error)=>{res.json({error})})
})

// New route - get - /fruits/new
app.get("/fruits/new", (req,res)=>{
    res.render("fruits/new.liquid")
})

// Create route
app.post("/fruits", (req, res)=>{
    // convert checkbox property to true or false (ternary operator)
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false 
    // create the new fruit
    Fruit.create(req.body)
    .then((fruit)=>{
        // redirect user back to index page
        res.redirect("/fruits")
    })
    .catch("error", (error)=>{res.json({error})})
})

// Edit Route - get - /fruits/:id/edit
app.get("/fruits/:id/edit", (req,res)=>{
    const id = req.params.id
    Fruit.findById(id)
    .then((fruit)=>{
        // render the edit page template with the fruit data
        res.render("fruits/edit.liquid", {fruit})
    })
    .catch("error", (error)=>{res.json({error})})
})

// update route - put request - "/fruits/:id"
app.put("/fruits/:id", (req, res) => {
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
app.delete("/fruits/:id", (req,res)=>{
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
app.get("/fruits/:id", (req, res) => {
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




////////////////////////////////////////////////////////////////////////
// Setup Server Listener
////////////////////////////////////////////////////////////////////////
const PORT = process.env.PORT;
app.listen(PORT, ()=>{console.log(`Server is listening on port ${PORT}`)});