const mongoose = require('mongoose');

const RegLoginSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
        // index: {
        //     unique:true
        // },
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type : String,
        required:true
        },
   
    otp: {
        type : String
    },
},
{timestamps:true}
) 

module.exports = mongoose.model('user', RegLoginSchema)

