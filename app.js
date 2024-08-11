const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const loginModel = require("./models/admin")
const peopleModel = require("./models/missingPeople")
const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://rosemol:rosemol1t@cluster0.4vxoeox.mongodb.net/rescuedb?retryWrites=true&w=majority&appName=Cluster0")

app.get("/test",(req,res)=>{
    res.json({"status":"success"})
})

app.post("/adminSignUp",(req,res)=>{
    let input = req.body
    let hashedpassword = bcrypt.hashSync(input.password,10)
    input.password = hashedpassword
    console.log(input)
    let result = new loginModel(input)
    result.save()
    res.json({"status":"success"}) 
})

app.post("/adminSignIn",(req,res)=>{
    let input = req.body
    let result = loginModel.find({username:input.username}).then(
        (response)=>{
            if (response.length>0) {
                const validator = bcrypt.compareSync(input.password,response[0].password)
                if (validator) {
                    jwt.sign({email:input.username},"rescue-app",{expiresIn:"1d"},
                        (error,token)=>{
                            if(error){
                                res.json({"status":"Invalid Authentication"})
                            }else{
                               res.json({"status":"success","token":token}) 
                            }
                        }
                    )
                } else {
                    res.json({"status":"wrong password"})
                }
            } else {
                res.json({"status":"username doesn't exist"})
            }
        }
    ).catch()
})

app.post("/addPeople",(req,res)=>{
    let input = req.body
    let token = req.headers.token
    jwt.verify(token,"rescue-app",
        (error,decoded)=>{
            if (decoded && decoded.email) {
                let result = new peopleModel(input)
                result.save()
                res.json({"status":"success"})
            } else {
                res.json({"status":"Failed to register"})
            }
        }
    )
})

app.listen(5050,()=>{
    console.log("server started")
})