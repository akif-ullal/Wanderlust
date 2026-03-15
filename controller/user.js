const User = require("../models/user");
module.exports.renderSignUpForm = (req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.signUp = async(req,res,next)=>{
   try{
        let{email,username,password}=req.body;
        let newUser = new User({email,username});

        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser,(e)=>{
            if(e){
                next(e);
            }
            req.flash("success","welcome to WenderLust");
            res.redirect("/listing");
        });
    }catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success","welcome to WenderLust");
    const redirectingUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectingUrl);
};

module.exports.logout=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/listing");
    });
};