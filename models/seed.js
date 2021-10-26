////////////////////////////////////////////////////////////////////////
// Import Our Dependencies
////////////////////////////////////////////////////////////////////////
const mongoose = require("./connection"); // This already has mongoose connection
const Fruit = require("./fruit");

////////////////////////////////////////////////////////////////////////
// Seed Code
////////////////////////////////////////////////////////////////////////

// Save connection in in a variable 
const db = mongoose.connection;

// Make sure code doesn't run until connection is open 
db.on("open", ()=>{
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
        .then((data)=>{
            console.log(data);
            db.close();
        })
    })
});

