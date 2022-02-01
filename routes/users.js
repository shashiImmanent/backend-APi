const express = require('express');
const userController = require('../controller/users');
 const router = express.Router();
 
 router.post("/register", userController.register);
 router.post("/login", userController.login);
 router.post("/password_change", userController.password_change);

 //Route url to refresh the token.
 
   // router.get("/refresh_token", userController.refreshtoken);

 module.exports = router;