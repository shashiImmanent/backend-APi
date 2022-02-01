const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const  validatechangePasswordInput = require("../validation/change-password");
 // Register User 
 //@route users/register
const userController = {
    register:async(req,res)=>{
        try{
            console.log(req.body);
            const {errors , isValid} = validateRegisterInput(req.body);
            if(!isValid){
                return res.status(400).json(errors);
            }
            const {name , email, password} = req.body;
            const user = await User.findOne({email});
            if(user){
                return res.status(400).json({msg:"user already exists"});
            }
            const passwordhash =  await bcrypt.hash(password, 10);
            const newUser = await new User({
                name:name,
                email:email,
                 password:passwordhash,
            });

            await newUser.save();
            return res.json({
                status:"200",
                msg:"successfully Registered"
            }) 
 
        }catch(err){
           return  res.status(500).json({msg:err.message});
        }
    },
// Login user
//   @route users/login

login: async(req,res)=>{
    try{
        console.log(req.body);
    const {errors, isValid} = validateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json({ errors});
    }
    const {email , password } = req.body;
   
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({errors:{email:"Invalid Email"}});
    }
     if(user.status==0){
         return res.status(0).json({errors:{email:"user is not active"}});
     }

     const isMatch = await bcrypt.compare(password,user.password);
     if(!isMatch) {
         return res.status(400).json({errors:{password:"Password deos not matched"}});
     }
     
     return res.json({
         status:"200",
         msg:"Login successfully"
    });

    }catch(err){
       return res.status(500).json({msg: err.message});
    }
},

logout: async(req,res)=>{
     try{
        res.clearCookie(refreshtoken,{path:"/users/refresh_token"});
        return res.json({ status: 1, msg: "logged out" });
     }
     catch(err){
        return res.status(500).json({msg:err.message});
     }
},

// change password
// @router /users/password_change
password_change:async(req,res)=>{
    try{
        console.log(req.body);
        //chech validation
      const {errors, isValid} = validatechangePasswordInput(req.body);

      if(!isValid){
          return res.status(400).json(errors);
      }
      const user = await User.findOne({email:req.body.email});
      const isMatch = bcrypt.compare(req.body.oldpassword,user.password);
      if(!isMatch){
          return  res.status(400).json({errors:{oldpassword:"Incorrect Password"}});
      }
      const passwordhash = await  bcrypt.hash(req.body.password, 10);
      await User.findOneAndUpdate({
          email:req.body.email,
      },{
          password:passwordhash,
      });
      return res.status(200).json({msg:"Password successfully changed"});
    }catch(err){
     return res.json({ error: 0, errors: { oldPassword: err.message } });
    }
},




}





module.exports  = userController;