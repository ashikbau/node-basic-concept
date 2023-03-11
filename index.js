const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const dbconnect = require("./utils/dbConnection");

const toolsRouter = require('./routes/v1/tools.route');
const viewCount = require("./middleware/viewCount");
const errorHandler = require("./middleware/errorHandler");
const { connectToServer } = require("./utils/dbConnection");

app.use(cors());
app.use(express.json());
// app.use(express.text());

app.use(express.static("public"));
app.set("view engine", "ejs");

// sendMails()

// app.use(viewCount)
// app.use(limiter)
app.get("/",(req,res)=>{
  res.send("Example app listening is Running")
})

connectToServer((err)=>{
  if(!err){
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } else{
    console.log(err)
  }
})

app.use('/api/v1/tools',toolsRouter);

// app.get("/", (req, res) => {
  
//   // res.sendFile(__dirname + "/public/test.html");
//   res.render("home.ejs", {
//     id: 5,
//     user: {
//       name: "test",
//     },
//   });
// });




app.get("*",(req,res)=>{
  console.log("no route found")
})


app.use(errorHandler)



process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  app.close(() => {
    process.exit(1);
  });
});


