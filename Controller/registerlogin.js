
const User = require("../Models/user.model");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer')
const jwt = require("jsonwebtoken");
const jwtDecode = require('jwt-decode');
const dotenv = require('dotenv');
const auth = require('../Middleware/middleware');
// { default: mongoose } = require("mongoose");
dotenv.config();

var email;
var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',
    auth: {
        user:process.env.user ,
        pass:process.env.pass
    }
});

module.exports = {
  // *** Register User Accont ***
  register : async (req, res) => {
    const { email,  password, confirm, } = req.body;
if ( !email || !password || !confirm) {
res.send("Fill empty fields");
}
//Confirm passwords
if (password !== confirm) {
console.log("password must match");
} else {
//Validation
User.findOne({ email: email }).then((user) => {
  if (user) {
    res.send("email exists");
  } else {
    const newUser = new User({
      email:email,
      password:password,
      otp,  
    });
    newUser.save()
    //password Hashing 
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save()
         
      })
    );
  }
});
}
    // send mail with defined transport object
    var mailOptions = {
        to: req.body.email,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
         res.send({
           email,
           password,
           otp
         });
    });
},
    // *** Login Registered Account ***
    login: async (req,res)=>{
    const body = req.body;
    const user = await User.findOne({ email: body.email });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(body.password, user.password,);
      if (validPassword) {
        const payload = {
          _id:user._id,
          email:user.email
        };
        jwt.sign(
          payload,
          "randomString",
          {
            expiresIn: "10h"
          },
          (err, token) => {
            if (err) throw err;
            const decoded = jwtDecode(token)
            console.log(decoded)
            res.status(200).json({
              messsage:"Successfully Logged In",
              token:token,
              email:email
            });         
          });
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
    },

    
   

    // *** verify user by JSON Bearer Token ***
    findAll : (auth,async (req,res) => {
      const email = req.query.email;
      var condition =  email ? {  email: { $regex: new RegExp( email), $options: "i" } } : {};
      User.find(condition)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving user Detail."
          });
        });
    }),


    // *** Verify OTP ***
    verify: async  (req, res) =>{
        if (req.body.otp == otp) {
            res.send("You has been successfully registered");  
        }
        else {
            res.render('otp', { msg: 'otp is incorrect' });
        }
    },
    
//   //  *** resend otp on registered email ***
//     resend: function(req,res){
//         email = req.body.email;
//         var mailOptions = {
//             to: email,
//             subject: "Otp for registration is: ",
//             html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
//         };
    
//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 return console.log(error);
//             }
//             console.log('Message sent: %s', info.messageId);
//             console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//             res.send('otp has been sent')
//         });
//     }
}

