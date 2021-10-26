////////////////////////////////////////////////////////////////
// Import our Dependencies 
////////////////////////////////////////////////////////////////
require("dotenv").config(); // loading .env variables
const mongoose = require("mongoose");

////////////////////////////////////////////////////////////////////////
// Establish Database Connection
////////////////////////////////////////////////////////////////////////
// setup the inputs for mongoose connect 
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
// Export the connection
////////////////////////////////////////////////////////////////////////
module.exports = mongoose