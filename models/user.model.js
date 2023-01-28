const { model,Schema } = require("mongoose");


const UserSchema= new Schema ({
    name : String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    bmiCalculations: [{
        bmi: { type: Number },
        height: { type: Number },
        weight: { type: Number },
    }],
    version:false
})

const UserModel = model("users", UserSchema);

module.exports= UserModel;