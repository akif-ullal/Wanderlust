if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
  // console.log(process.env.SECRET_KEY);
}


const express=require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");
const session = require('express-session');
const {MongoStore} = require('connect-mongo');
const  flash = require('connect-flash');
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require('passport-local');
const signUpUser = require("./routes/user.js");
const multer  = require('multer');
const { clear } = require('console');




const port=8080;
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine ('ejs', ejsMate);

const dbURL=process.env.ATLASDB_URL;

console.log(dbURL);

main().then((data)=>{
    console.log("db is connected");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
}

const store =  MongoStore.create({
  mongoUrl:dbURL,
  crypto : {
    secret : process.env.SECRET,
  },
   touchAfter: 24 * 3600,
});

store.on("error",()=>{
  console.log("ERROR IN MONGODB SESSION STORE");
});

const sessionOptions = {
  store,
  secret:  process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires : Date.now()+ 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currUser = req.user || null;
  next();
});

app.get("/test-flash", (req,res)=>{
    console.log(req.flash("success")); 
    res.send("Flash test");
});


app.use("/listing",listing);
app.use("/listing/:id/review",review);
app.use("/",signUpUser);

app.use(/.*/,(req,res,next)=>{
  next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
  let {statusCode = 500,message = "something went wrong"} = err;
  res.status(statusCode).render("listing/error.ejs",{message});
});

app.listen(port,()=>{
    console.log("server is listening");
});

