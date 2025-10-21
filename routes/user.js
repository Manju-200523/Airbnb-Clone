const  express = require('express');
const router = express.Router();
const passport=require("passport");
const wrapAsync = require('../utils/wrapAsync.js'); 
const userController =require("../controllers/user.js");
const {saveRedirectUrl}=require("../middleware.js");

router
  .route("/signup")
  .get(userController.renderSignup)
  .post( wrapAsync(userController.Signup));

router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true
    }),userController.login
  
);


router.get("/logout",userController.logout);


module.exports=router;