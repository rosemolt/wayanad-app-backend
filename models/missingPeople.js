const mongoose = require("mongoose")
const peopleSchema = mongoose.Schema(
    {
        Fullname:String,
        phoneNumber:String,
        village:String,
        place:String,
        pincode:String,
        houseNumber:String,
        missingDate:Date,
        aadharNumber:String,
        gender:String,
        age:String
    }
)

const peopleModel = mongoose.model("peoples",peopleSchema)
module.exports = peopleModel