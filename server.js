////////////////////////////////////////////////////////////////////////
// Import Our Dependencies
////////////////////////////////////////////////////////////////////////
require("dotenv").config(); // brings in dotenv vars
const express = require("express"); // web framework
const morgan = require("morgan"); // logger
const methodOverride = require("method-override"); // swap request methods
const path = require("path"); // helper function for file paths 
const FruitsRouter = require("./controllers/fruits");
const UserRouter = require("./controllers/user");
const session = require("express-session") // session middleware
const MongoStore = require("connect-mongo") // save sessions in mongo
////////////////////////////////////////////////////////////////////////
// Create our app with object, configure with liquid
////////////////////////////////////////////////////////////////////////
// Import liquid
const liquid = require("liquid-express-views");
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
app.use(express.urlencoded({extended: true}));
// setup our public folder to server files statically
app.use(express.static("public"));
// middlware to create sessions (req.session)
app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create({mongoUrl: process.env.DATABASE_URL}),
    resave: false
}))

////////////////////////////////////////////////////////////////////////
// Routes
////////////////////////////////////////////////////////////////////////
app.get("/", (req, res)=>{
    res.render("index.liquid")
});

// Register Fruits Router 
app.use("/fruits", FruitsRouter);

// Register User Router
app.use("/user", UserRouter);
////////////////////////////////////////////////////////////////////////
// Setup Server Listener
////////////////////////////////////////////////////////////////////////
const PORT = process.env.PORT;
app.listen(PORT, ()=>{console.log(`Server is listening on port ${PORT}`)});