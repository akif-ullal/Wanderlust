const express=require("express");
const router = express.Router();
const passport = require("passport");
const {redirectToUserUrl} = require("../middleware.js");
const userController = require("../controller/user.js");

router.route("/signup")
.get(userController.renderSignUpForm)
.post(userController.signUp);


router.route("/login")
.get(userController.renderLoginForm)
.post(
    redirectToUserUrl,
    passport.authenticate('local', { failureRedirect: '/login',failureFlash: "Invalid username or password" }),
    userController.login    
);


router.get("/logout",userController.logout);

module.exports=router;