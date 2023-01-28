const express = require("express");
const mongoose= require("mongoose");
const cors= require("cors");
const UserModel = require("../models/user.model");
require("../config/db")

// mongoose.set('strictQuery', false);

const app= express();
app.use(express.json());
app.use(cors());
app.get("/", (req,res)=>{
    res.send("Welcome to BMI Backend application")
})
// register
app.post("/register",async (req,res)=>{
 const {name,email, password} = req.body;
  let validUser= await UserModel.findOne({email});

  if(validUser){
    res.status(200).send("User is already registered with this Email!!");
  }
  try{
     let User=  await new UserModel({name,email,password});
     User.save();
     res.status(201).send("User is registered Succesfully !! ")
  }
  catch(err){
    console.log(err)
    res.send("Something went Wrong !!")
  }

})
// login
app.post("/login",async (req,res)=>{
    const {email, password} = req.body;
     let validUser= await UserModel.findOne({email});
   
     if(!validUser){
        res.send("User is not registered !!")
    }
    else if(validUser && validUser.password !== password){
        res.send("Wrong Password, Chek credentials!!")
    }
    else {
        res.status(201).send("User Logged in Successfully!!");
    }
   })
// getProfile
app.get("/profile/:email",async (req,res)=>{
    const {email} = req.params;
    console.log(email);
    let validUser= await UserModel.findOne({email});
    console.log(validUser)
    if(validUser){
        res.status(200).send(validUser);
    }
    else{
        res.send("User not Found")
    }
})
// logout


// calculateBMI
app.post("/bmiCalculate",async(req,res)=>{
    const { height, weight,userId } = req.body;
    console.log(height,weight,userId);
     let bmi=Number(weight)/Number(height);
     bmi = Math.floor(bmi);
     console.log("bmi:", bmi);
     let result;
    if(bmi<18.5){
        res.send({BMI:bmi,result:"Underweight"})
     }
    else if(bmi>=18.5 && bmi<=24.9){
        res.send({BMI:bmi,result:"Normal Weight"})
    }
    else if(bmi>=25 && bmi<=29.9){
        res.send({BMI:bmi,result:"Overweight"})
    }
    else if(bmi>=30 && bmi<=34.9){
        res.send({BMI:bmi,result:"Obesity"})
    }
    else if(bmi>=35 && bmi<=39.9){
        res.send({BMI:bmi,result:"Extreme Obesity"})
    }else{
        res.send({BMI:bmi,result:"Extreme Obesity"})
    }
    let Updateuser= await UserModel.findByIdAndUpdate(userId, {$push: {bmiCalculations: {bmi, height, weight}}});
    Updateuser.save(); 
    //  res.send({BMI:bmi})
})
mongoose.connect(DB_URL).then(() => {
    app.listen(8080, () => {
      console.log(`Server Started @ http://localhost:8080`);
    });
  }); 

