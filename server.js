var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
var ip = '0.0.0.0';
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const jwt= require("jsonwebtoken");
require('dotenv').config()
var createError = require('http-errors')
const nodemailer = require('nodemailer');
const {google, connectors_v2} = require('googleapis');
const { auth } = require('google-auth-library');
var multer = require('multer');
var admin = require("firebase-admin");
var cron = require('node-cron');
var crypto = require('crypto');
const collect = require('collect.js');
var moment = require("moment");

var mongoose = require("mongoose")
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

mongoose.connect("mongodb://127.0.0.1:27017/mydb");

//app.set('view engine', 'ejs');

//app.get('/',(req,res) => {
//    res.render('ihome.ejs');
//})
//app.use('/assets', express.static(__dirname + '/assets'));

//-----------------signup API-------------------
var signupSchema = new mongoose.Schema({
    _id: {
        type: Number,
        default: //generateRandom()
        ()=> {
            return Math.floor(Math.random() * 100);
        }
    },
    firstName: {
        type: String,
        match: /[a-zA-Z]/ ,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        match: /[a-zA-Z]/ ,
        required: true,
        trim: true
    },
    email: {
        type: String,
        match: /[a-zA-Z0-9]+.[a-zA-Z0-9]+@[a-zA-Z]+.com$/ ,
        lowercase: true ,
        required: true
    },
    password: {
        type: String ,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: String,
        match: /[0-9]{2,}-[0-9]{2,}-[0-9]{4,}/ ,
        required: true
    },
    mobile: {
        type: Number,
        // max:10,
        // min:10
    },
    latitude: {
        type: SchemaTypes.Double,
        required: true
    },
    longitude: {
        type: SchemaTypes.Double,
        required: true
    },
    deviceType: {
        type: String,
        required: true
    },
    fcmToken: {
        type: String,
        required: false
    },
    model: {
        type: String,
        required: true
    },
    os: {
        type: String,
        required: true
    },
    createTime: {
        type: Number,
        default: ()=>{
           return Date.parse(Date());
        }
    },
    modifiedTime: {
        type: Number,
        default: ()=>{
            return Date.parse(Date());
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    block: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default:"http://192.168.1.67:8080/uploads/default.png"
    }
});

var Signup = mongoose.model("Signup", signupSchema,"users");

app.post("/v1/user/signup",  (req, res) => {
    var datas = JSON.parse(JSON.stringify(req.body));
    var myData = new Signup(datas);
    var jwtemail = req.body.email;

    console.log(req.body);
    
    Signup.findOne({email: datas.email},(err,existingUser) => {
        if (existingUser == null) {
            const token = jwt.sign({jwtemail},process.env.access_token_secret, {

                expiresIn: "7d"

            });
            console.log(token);
            myData.save()
            .then( ()=> {
                Signup.findOne({ email:datas.email})
                .select(' firstName lastName email password _id ')
                .exec((err, docs) => {
                    if (err) {
                        res.status(400).json({
                            status:400,
                            success:false,
                            message:"User data not found",
                            data:{}
                        });
                    }
                    else {
                        console.log('saved');
                        var _id = docs._id;
                        var email = docs.email;
                        var firstName = docs.firstName;
                        var lastName = docs.lastName;
                        var userPassword = docs.password;
                        var key = Buffer.from('thisismypassword');
                        var iv = Buffer.from('thisismypassword').toString('hex').slice(0, 16);
                        var cipherPassword = crypto.createCipheriv('aes-128-cbc', key, iv);
                        var password = cipherPassword.update(userPassword, 'utf8', 'hex')
                        password += cipherPassword.final('hex');
                        var filter = {
                            email:datas.email
                        }
                        var update = {
                            password: password
                        }
                        Signup.findOneAndUpdate(filter,update,(err,docs) => {
                            if(docs) console.log("updated");
                            else console.log('error');
                        });
                        var firstName = docs.firstName;
                        var lastName = docs.lastName;
                        var email = docs.email;
                        var _id = docs._id;
                        res.status(200).json({
                            status:200,
                            success:true,
                            message:"Success",
                            data: { _id, email, firstName, lastName, token}
                        });
                    }
                });
            })
            .catch(()=> {
                res.status(400).json({
                    status:400,
                    success:false,
                    message:"Bad request",
                    data:{}
                });
            });
        }
        else res.status(400).json({
            status:400,
            success:false,
            message:"User already exist",
            data: {}
        });
    });

//--------------------------------------------------

//-----------------Mobile Verify--------------------
// var mobileSchema = new mongoose.Schema({
//     _id: Number,
//     mobile: Number,
//     otp:Number
// })
// var Mobile = mongoose.model("Mobile", mobileSchema,"users");

// app.post('/v1/mobile',(req,res) => {
//     var datas = JSON.parse(JSON.stringify(req.body));
//     console.log(datas);
//     var filter = {
//         _id: datas._id
//     }
//     var update = {
//         mobile: datas.mobile,
//         otp: 123456
//     }
//     Mobile.findByIdAndUpdate(filter,update,(err,result) => {
//         if(err) {
//             res.status(400).json({
//                 status:400,
//                 success:false,
//                 message:"Error sending OTP",
//                 data:{}
//             });
//         }
//         else {
//             res.status(200).json({
//                 status:200,
//                 success:true,
//                 message:"OTP sent successfully",
//                 data: {}
//             });
//         }
//     })
// })

// app.post('/v1/mobile/verify',(req,res) => {
//     var datas = JSON.parse(JSON.stringify(req.body));
//     console.log(datas);
//     Mobile.findOne({ _id:datas._id })
//     .select('otp')
//     .exec((err, result) => {
//         if(err) {
//             res.status(400).json({
//                 status:400,
//                 success:false,
//                 message:"Error sending OTP",
//                 data:{}
//             });
//         }
//         else {
//             if(result.otp==datas.otp) {
//                 res.status(200).json({
//                     status:200,
//                     success:true,
//                     message:"OTP verified",
//                     data: {}
//                 });
//             }
//             else {
//                 res.status(400).json({
//                     status:400,
//                     success:false,
//                     message:"Wrong OTP",
//                     data:{}
//                 });
//             }
//         }
//     })
// })
//--------------------------------------------------
});

//--------------------home API----------------------
var subjectSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    // subId: Number,
    name: {
        type: String
    },
    create: {
        type: String,
        default: ()=>{
           return Date.parse(Date());
        }
    },
    update: {
        type: String,
        default: ()=>{
           return Date.parse(Date());
        }
    },
    status: {
        type: Boolean
    },
    image: {
        type: String
    }
});

var Subjects = mongoose.model("subjects", subjectSchema,"subjects");

function verifyAccessToken(req,res,next){
    if (!req.headers['authorization'])
    return next(createError.Unauthorized())
    const bearerHeader= req.headers['authorization']
    const bearerToken= bearerHeader.split(' ')
    const token= bearerToken[1]
    jwt.verify(token,process.env.access_token_secret, (err, payload) => { 
        if(err) {
            if(err.name=='JsonWebTokenError') {
               next( res.status(400).json({status:400,success:false,message:"Authentication failed"}));
            }
            else next(res.status(400).json({status:400,success:false,message:"Session expire",data:{}}))
        }
        req.datas= payload
        next()
    })
}

app.get("/v1/session",verifyAccessToken,(req,res)=>{
    if(req.headers['authorization']!== null) {
        res.status(200).json({
            status:200,
            success:true,
            message:"Authorized user",
            data:{}
        });
    }
    else res.status(400).json({
        status:400,
        success:false,
        message:"Session expire",
        data:{}
    })
})

app.get("/v1/home",verifyAccessToken,(req,res) => {
    if(req.headers['authorization']!== null) {
        Subjects.find({status:true},'_id sub image').exec((err, result) => {
            if (err) res.status(400).json({
                status:400,
                success:false,
                message:"Error sending subject list",
                data:{}
            });
            else res.status(200).json({
                status:200,
                success:true,
                message:"Success",
                data:result
            });
        })
    }
    else res.status(400).json({status:400,success:false,message:"JsonWebTokenError",data:{}});   
})

app.use('/images', express.static(__dirname + '/images'));

//--------------------------------------------------

//-------------------Login API----------------------
var loginSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    email: {
        type: String,
        match: /[a-zA-Z0-9]+.[a-zA-Z0-9]+@[a-zA-Z]+.com$/ ,
        lowercase: true ,
        required: true ,
        trim: true
    },
    password: {
        type: String ,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        match: /[a-zA-Z]/ ,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        match: /[a-zA-Z]/ ,
        required: true,
        trim: true
    },
    mobile: {
        type: String
    },
    fcmToken: String
});

var Login = mongoose.model("login", loginSchema , "users");

app.post("/v1/user/login",  (req, res) => {
    var datas = JSON.parse(JSON.stringify(req.body));
    var jwtemail = req.body.email;
    var userPassword = datas.password;
    var key = Buffer.from('thisismypassword');
    var iv = Buffer.from('thisismypassword').toString('hex').slice(0, 16);
    var cipherPassword = crypto.createCipheriv('aes-128-cbc', key, iv);
    var password = cipherPassword.update(userPassword, 'utf8', 'hex')
    password += cipherPassword.final('hex');
    Login.findOne({email: datas.email,password: password},(err,loginUser) => {
        if  (loginUser !== null) {
            const token = jwt.sign({jwtemail},process.env.access_token_secret, {
                expiresIn: "7d"
            });
            var _id = loginUser._id;
            var email = loginUser.email;
            var firstName = loginUser.firstName;
            var lastName = loginUser.lastName;
            var mobile = loginUser.mobile;
            var image = loginUser.image;
            var filter = {
                email: datas.email
            }
            var update = {
                fcmToken: datas.fcmToken
            }
            Login.findOneAndUpdate(filter,update,(err,docs) => {
                if(docs) console.log(docs);
                else console.log("error updating fcm");
            });
            res.status(200).json({                
                status:200,
                success:true,
                message:"Login Successful",
                data:{
                _id , token, email, firstName, lastName, mobile , image
                }
            });
            console.log('login successful');
        }
        else res.status(400).json({
            status:400,
            success:false,
            message:"Username/Password not valid",
            data:{}
        });   
    });
});

//--------------------------------------------------

//------------------Forgot API----------------------

var forgotSchema = new mongoose.Schema({
    email: String,
    otp: Number,
    password: String
})
var Forgot = mongoose.model("Forgot", forgotSchema,"users");

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

function generateRandom(min = 1000, max = 9999,rand) {
    let difference = max - min;
    rand = Math.random();
    rand = Math.floor( rand * difference);
    rand = rand + min;
    return rand;
}

app.post('/v1/user/forgot',(req,res) => {
    var datas = JSON.parse(JSON.stringify(req.body));
    const oAuth2Client =  new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

    Forgot.findOne({email: datas.email},(err,existingUser) => {
        if (existingUser !== null) {
            async function sendMail() {
                const accessToken = await oAuth2Client.getAccessToken()
                const transport  = nodemailer.createTransport({
                    service:'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: 'jeetogyanse@gmail.com',
                        clientId: CLIENT_ID,
                        clientSecret: CLIENT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        accessToken: accessToken
                    }
                })
                const mailOptions = {
                    from: 'JeetoGyanSe <jeetogyanse@gmail.com>',
                    to: ''+datas.email,
                    subject: 'Forgot your password',
                    text: 'OTP to reset your password is '+generateRandom(),
                };
                transport.sendMail(mailOptions);
                let otps = mailOptions.text.substring(30);
                //console.log(otps);
                var filter = {email: datas.email};
                var update = { otp : otps };
                Forgot.findOneAndUpdate(filter,update,(err,docs) => {
                    if(docs) console.log("updated");
                    else console.log('error');
                });
            }
            sendMail()
            .then( ()=> res.status(200).json({
                status:200,
                success:true,
                message:"Mail Sent",
                data:{}
            }))
            .catch(()=> res.status(400).json({
                status:400,
                success:false,
                message:"Something went wrong please try again",
                data:{}
            }))
        }
        else res.status(400).json({
            status:400,
            success:false,
            message:"User does not exist",
            data:{}
        });
    })
})

app.post('/v1/user/forgot/otp',(req,res) => {
    var datas = JSON.parse(JSON.stringify(req.body));
    console.log(datas);
    Forgot.findOne({email: datas.email}).select(' otp -_id ').exec((err, docs) => {
        if (err) {
            res.status(400).json({
                status:400,
                success:false,
                message:"Not found",
                data:{}
            });
        }
        else {
            if(req.body.otp == docs.otp) {
                // res.status(200).json({status:200,success:true,message:"Success"});
                var userPassword = datas.password;
                var key = Buffer.from('thisismypassword');
                var iv = Buffer.from('thisismypassword').toString('hex').slice(0, 16);
                var cipherPassword = crypto.createCipheriv('aes-128-cbc', key, iv);
                var password = cipherPassword.update(userPassword, 'utf8', 'hex')
                password += cipherPassword.final('hex');
                var filter = { email: datas.email };
                var update = { password : password };
                Forgot.findOneAndUpdate(filter,update,(err,docs) => {
                    if(docs) res.status(200).json({
                        status:200,
                        success:true,
                        message:"Password Updated",
                        data:{}
                    });
                    else res.status(400).json({
                        status:400,
                        success:false,
                        message:"Not found",
                        data:{}
                    });
                });
            }
            else res.status(400).json({
                status:400,
                success:false,
                message:"Wrong OTP",
                data:{}
            });
        }
    })
})

//---------------------------------------------------------

//-------------------Questions and Result API--------------

var gameSchema = new mongoose.Schema({
    sub: String,
    answer: String,
    subId: Number,
    _id: Number
});
Game = mongoose.model('Game', gameSchema, "questions");

const contestSchema = new mongoose.Schema({
    contestId : Number,
    contestTime : Number,
    date : String,
    status : Boolean
});
const Contest = mongoose.model('Contest', contestSchema, "contestData");

var resultSchema = new mongoose.Schema({
    userId: {
        type: Number,
        ref: "Signup"
    },
    contestId: Number,
    contestTime: Number,
    answerTime: Number,
    correctAnswer: Number,
    subId : Number,
    isWinner : Boolean,
    date: String,
    status :Boolean
})
var Result = mongoose.model('Result', resultSchema, "resultData");

app.post("/v1/question",verifyAccessToken,(req,res) => {
    if(req.headers['authorization']!== null) {
        console.log(req.body);
        var sub = JSON.parse(JSON.stringify(req.body));
        //Game.find(sub).count().exec((err, count) => {
       // var random = Math.floor(Math.random() * count);
        Game.find({subId: sub.subId} ,'_id questions option1 option2 option3 option4').limit(5).exec((err, result) => {
            if (err) res.status(400).json({
                status:400,
                success:false,
                message:"Unable to find questions",
                data:{}
            });
            else res.status(200).json({
                status:200,
                success:true,
                message:"List of questions",
                data:result
            });
        })
    }
    else
    res.status(400).json({
        status:400,
        success:false,
        message:"Unable to find questions",
        data:{}
    });
   // })
})

app.post("/v1/question/result",verifyAccessToken,(req,res) => {
    if(req.headers['authorization']!== null) {
        var datas = JSON.parse(JSON.stringify(req.body));
        console.log(datas);
        var myData = new Result(datas);
        

        Game.find({ subId: datas.subId },"answer",(err,result) => {
            if(err) console.log("Wrong request to server");
            else {
            var count = 0;
            console.log(result);
            // if(result[datas.question1-1].answer == datas.answer1) {
            //     count++;
            // }
            if(result[0].answer == datas.answer1) {
                count++;
            }
            if(result[1].answer == datas.answer2) {
                count++;
            }
            if(result[2].answer == datas.answer3) {
                count++;
            }
            if(result[3].answer == datas.answer4) {
                count++;
            }
            if(result[4].answer == datas.answer5) {
                count++;
            }

            console.log(count);

            var contestData = {
                contestId :datas.contestId,
                contestTime :datas.contestTime,
                date : new Date(datas.contestTime).toLocaleDateString(),
                status : true
            }
            var myData2 = new Contest(contestData);

            var isWinner ;
            if(count == 5){
                isWinner= true
            }
            else isWinner = false

            myData2.save()
            myData.save()
            .then( ()=> {
                var filter = {userId: datas.userId, contestTime: datas.contestTime};
                var update = { correctAnswer : count , isWinner : isWinner};
                Result.findOneAndUpdate(filter,update,(err,docs) => {
                    if(err) {
                        var filter = {userId: datas.userId , contestTime: datas.contestTime};
                        var update = {status : false};
                        Result.findOneAndUpdate(filter, update,(err,docs)=>{
                            if(err)
                            res.status(400).json({
                            status:400,
                            success:true,
                            message:"Unable to show result",
                            data:{}
                            });
                        })
                    }
                    else 
                        var filter = {userId: datas.userId , contestTime: datas.contestTime};
                        var update = {status : true};
                        Result.findOneAndUpdate(filter, update,(err,docs)=>{
                            if(docs){
                                res.status(200).json({
                                status:200,
                                success:true,
                                message:"Result",
                                data: count
                                });
                            }
                        })  
                });
                
            })
            .catch( () =>{
                res.status(400).json({
                    status:400,
                    success:true,
                    message:"Unable to show result",
                    data:{}
                });
            })
            }
        })
    }
    else
    res.status(400).json({
        status:400,
        success:true,
        message:"Unable to show result",
        data:{}
    });
})

//----------------------------------------------------------

//-----------------------View Profile API-------------------

var updateSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    dateOfBirth: String,
    about: String,
    _id: Number,
    image: String
  })
  var Update = mongoose.model("Update", updateSchema,"users");

app.post("/v1/user/profile",verifyAccessToken,(req,res) => {
    if(req.headers['authorization']!== null) {
        var datas = JSON.parse(JSON.stringify(req.body));
        console.log(datas);
        Update.findById(datas._id,"-_id image firstName lastName email dateOfBirth mobile image about ",(err,docs) => {
            if(docs) res.status(200).json({
                status:200,
                success:true,
                message:"User data",
                data: docs
            });
            else res.status(400).json({
                status:400,
                success:false,
                message:"Unable to find the user",
                data:{}
            });
        })
    }
    else
    res.status(400).json({
        status:400,
        success:false,
        message:"Unable to find the user",
        data:{}
    });
})

  //------------------------------------------------------------------

  //----------------------------Logout API----------------------------

var logoutSchema = new mongoose.Schema({
    _id: Number,
    fcmToken: String
})
var Logout = mongoose.model("Logout", logoutSchema,"users");

app.post("/v1/user/logout",(req,res) => {
    var datas = JSON.parse(JSON.stringify(req.body));
    console.log(datas);
    var filter = {
    _id: datas._id
    }
    var update = {
        fcmToken: ""
    }
    Logout.findOneAndUpdate(filter,update,(err,docs) => {
        if(docs) res.status(200).json({
            status:200,
            success:true,
            message:"Logout successfully",
            data:{}
        });
        else res.status(400).json({
            status:400,
            success:false,
            message:"Unable to logout",
            data:{}
        });
    })
})

//-------------------------------------------------------------------------

//----------------------update profile API---------------------------------
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null , 'uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname )
    }
});

var upload = multer({ storage: storage });

app.post('/v1/user/update', upload.single('image'),verifyAccessToken, (req, res) => {
    if(req.headers['authorization']!== null) {
        var filter = {
        _id: JSON.parse(req.body._id)
        }
        var update = {
            image: "http://192.168.1.67:8080/uploads/" + req.file.filename,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth
        }
        Update.findOneAndUpdate(filter,update,(err,docs) => {
            if(docs) res.status(200).json({
                status:200,
                success:true,
                message:"Profile updated successfully",
                data:{}
            });
            else res.status(400).json({
                status:400,
                success:false,
                message:"Something went wrong",
                data:{}
            });
        });
        console.log(filter);
        console.log(update);
    }
    else
    res.status(400).json({
        status:400,
        success:false,
        message:"Something went wrong",
        data:{}
    });
});

app.post('/v1/user/updates',verifyAccessToken, (req, res) => {
    if(req.headers['authorization']!== null) {
        var filter = {
        _id: JSON.parse(req.body._id)
        }
        var update = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth
        }
        Update.findOneAndUpdate(filter,update,(err,docs) => {
            if(docs) res.status(200).json({
                status:200,
                success:true,
                message:"Profile updated successfully",
                data:{}
            });
            else res.status(400).json({
                status:400,
                success:false,
                message:"Something went wrong",
                data:{}
            });
        });
    }
    // console.log(filter);
    // console.log(update);
    else    
        res.status(400).json({
        status:400,
        success:false,
        message:"Something went wrong",
        data:{}
    });
});

app.use('/uploads',express.static(__dirname + '/uploads'));
  
//-----------------------------------------------------------

//-------------------Push Notification API-------------------

var notificationSchema = new mongoose.Schema({
    title: String,
    body: String,
    date: Number,
    formatDate: String
})
var Notifications = mongoose.model("Notifications", notificationSchema,"notifications");

//cron.schedule("01 16 * * *", () => {
cron.schedule("55 09,11,13,15,18 * * *", () => {

    var serviceAccount = {
        "type": "service_account",
        "project_id": "jeetogyanse-e42f6",
        "private_key_id": "57370ad818e383152fbb445d74658dccba1ee2a3",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCQSCU4y0/Fx6mV\nXnVbNcsD1zvGlT+tUyqlOvPBJGA1AKIbfmZy4ceZZ5sfLCqq/lJUDQQdypkvG9sS\np3QgWzW29EO1P92RiCeFzYpC+WXgoxVxg1fZYsInuo8rVyGcAnZm73H7prHMwCSG\nBcMM1XN6Z5CJLFbHq6qZQXGOb1Guk+YEe9Mzc81KXT0nz/dcGVPIsreBvU6FbCc+\ns5lwksj+rvhNqda17/jXxqN6Fcn2B6onEzF7eupDkFKKbJ26WIzjtcnLZlsTjlhy\n+mULFmHB3wl517E1CZNcLYHtBOYK27jFQukKipot8K3yHldxb2n+Ttxh/jT9L6+r\njvtyIuKhAgMBAAECggEABZeGOclHcjbmz681hS90itWQr4WhTipnALhkMhwizmsT\n3VTsy48MmVl2naKslKv+rNtESZNMlJLTzslGqupeDpUw+plbEQTh40GwFiBsXmRz\ntE6O3RICzF9ipR9fYhiGVj75f/NZ+MGJqNgYUysCqr/QzkA1rM9ucTokGI0f8VAj\nOFbOcWBinFQhg7YSL3YpAvJKmjMII8SyY6RT19plRShCnyvFNzBmMq/mWK4b8NtE\n4dRmmMo+VxM35bX/TESfQo2vnKLOYCH6H7dGr6puoiXTJvyyynFG/MNYEERNqw5W\nDlIEc/FFFp62qzkvURxkLSGUw2C2Gx4+dTd3kx6GcQKBgQDAYgyBaSxT/FRSgwiU\nXkbcLATTSd5qIsN1X+IKLsPF6K1yZbZT3WnL8QlpoHwZUC6WVstLylHRFtC1h6wE\nyRyIU64SiUiG9soueH0YOFEz/dluYef9yuwi+pjYYdkMbdnst7d7dvb/5vdH5SUF\nBow9OugWtq9vpKmr/wbt5Hr6qwKBgQC//iYRq8IIWdpeXQ9b+8WEze8LrWz324UA\nDBnGeGlOHeoppGJWmq3yiWZx1FBBFGP9IGDZej9b9vj20cfAoDWdcH03oQQgaiKt\nPA/N8BZiHeDJxusWRdMdh6UbrJiBY1svKVrFQ/uC59nStLLq+tdakaMNvH6YnQYO\nnQSL4bPX4wKBgEmtg1KQf+yOR5DuI/wGeybZKOPud2K4e5jZJs11iX6jFMIqGADY\nXCtB3bP5RW3AWoczKFqXWmw0S6wqEIQorWe8fH8W2pLtsxLHDEmZT+gUgRAYKOv2\nqibfSGgeWSy8aWiSF5AOSJxKzUtYg6wADPdqNvZz8o5URrLbUcEL7tlPAoGARzVJ\nA1bT8Wr6DfOwBaq82IPUvF0HRGqbyqeyS6VPUVTRC77XZk2aZJFHeMKJPYoFh9Wh\ndifcJgzUzB6EWtJQ8GLPXnmO4ULcN6pGJlh8xMlWHSB1At7E7Xfo6fm62opyQGyz\nKOUM/MFnTboNfg+pHgNUGX0m6w2aOINOM19z54cCgYAcVM7zXbg0sE2XI+c/HSzq\nH3azYmFiWB74bZLTUl8QH7vAEiZLOklgemiWBSmPwN5ZXH6/ACgCDChdRfB5Ij7P\nLYL+rsj4CtTJ3jU1ZkLf6wQKw5Yg52AmFT31BmEMaRLpZTky49YxZF9CEIkZmtst\nb3UoJIa9/ZjW6b9MXZsobA==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-p5r73@jeetogyanse-e42f6.iam.gserviceaccount.com",
        "client_id": "105890869958800203786",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-p5r73%40jeetogyanse-e42f6.iam.gserviceaccount.com"
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    var notificationSchema = new mongoose.Schema({
      fcmToken: String
    })
    var Notify = mongoose.model("Notify", notificationSchema,"users");

    // var token = [];
    
    Notify.find({},'-_id fcmToken', (err,docs) => {
        var token = [];
        for(var i = 0 ; i <= docs.length-1 ; i++) {
            if (docs[i].fcmToken == "") {
                console.log("Empty Tokens");
            }
            else 
            token.push(docs[i].fcmToken);
        }
    
      var payload = {
        notification: {
          title: "Jeeto Gyan Se",
          body: "Contest starting soon-"+(Number(Date().substring(16,18))+1)+":"+(Number(Date().substring(19,21))-55)+"0",          // DAte function
          //android_channel_id: "",
          //icon: "https://jpeg.org/images/jpegsystems-home.jpg"
          // sound: "/res/raw/filename",
    
          //image: "https://jpeg.org/images/jpegsystems-home.jpg"   //"image URL (JPEG, PNG, BMP)"
    
          //tag: "",
          //color: "",
         // click_action: "",
        //  body_loc_key: "",
          //body_loc_args: ["",""], //JSON array as string
         // title_loc_key: "",
          //title_loc_args: {key:[""]} //JSON array as string
        }
        // data: {
          //
        // }
      }
    
      var options = {
        priority:"high"
        // collapse_key: "",
        // content_available: false,
        // timeToLive: Number,
        // mutable_content: false,
        // restricted_package_name: "",
        // dry_run: ""
      }
      var notificationData = {
        title: payload.notification.title,
        body: payload.notification.body,
        date: Date.parse(Date()),
        formatDate: Date().substring(0,15)
        }

        var myData = new Notifications(notificationData);
        admin.messaging().sendToDevice(token,payload,options)
        .then(() => {
            console.log(notificationData);
            myData.save()
            .then(() => {
                console.log("saved");
            })
            .catch(() => {
                console.log("Not saved");
            })
        })
        .catch((error)=>{
            console.log("Error Info:",error)
        })
    })
})

//----------------------------------------------------------

//--------------Notifications Data API----------------------

app.get("/v1/notifications",verifyAccessToken,(req,res) => {
    if(req.headers['authorization']!== null) {
        Notifications.find({},'-_id title body date formatDate')
        .sort({date:-1})
        .limit(10)
        .exec((err,result) => {
            if(err) res.status(400).json({
                status:400,
                success:false,
                message:"No notification data available",
                data:{}
            });
            else res.status(200).json({
                status:200,
                success:true,
                message:"Notification data",
                data:result
            });
        })
    }
    else
    res.status(400).json({
        status:400,
        success:false,
        message:"No notification data available",
        data:{}
    });
})

//-----------------------------------------------------------

//----------------Change Password----------------------------

var changeSchema = new mongoose.Schema({
    _id: Number,
    oldPassword: String,
    newPassword: String,
    password: String
});

var change = mongoose.model("Change", changeSchema,"users");

app.post("/v1/user/change-password",verifyAccessToken, (req,res) => {
    if(req.headers['authorization']!== null) {
        var datas = JSON.parse(JSON.stringify(req.body));
        change.findOne({ _id:datas._id}).select('-_id password').exec((err, docs) => {
            if (err) {
                res.status(400).json({
                    status:400,
                    success:false,
                    message:"User not found",
                    data:{}
                });
            }
            else {
                console.log('Password update block');

                var oldPassword = docs.password;

                var userOldPassword = datas.oldPassword;
                var key = Buffer.from('thisismypassword');
                var iv = Buffer.from('thisismypassword').toString('hex').slice(0, 16);
                var cipherPassword = crypto.createCipheriv('aes-128-cbc', key, iv);
                var password = cipherPassword.update(userOldPassword, 'utf8', 'hex')
                password += cipherPassword.final('hex');

                var userNewPassword = datas.newPassword;
                var key = Buffer.from('thisismypassword');
                var iv = Buffer.from('thisismypassword').toString('hex').slice(0, 16);
                var cipherPassword = crypto.createCipheriv('aes-128-cbc', key, iv);
                var newPassword = cipherPassword.update(userNewPassword, 'utf8', 'hex')
                newPassword += cipherPassword.final('hex');

                if( oldPassword == password ) {
                    var filter = { _id: datas._id };
                    var update = { password : newPassword };
                    change.findOneAndUpdate(filter,update,(err,docs) => {
                        if(docs) res.status(200).json({
                            status:200,
                            success:true, 
                            message:"Password updated successfully",
                            data:{}
                        })
                        else res.status(400).json({
                            status:400, 
                            success:false, 
                            message:"Error changing password",
                            data:{}
                        });
                    });
                }
                else res.status(400).json({
                    status:400, 
                    success:false, 
                    message:"Incorrect old password",
                    data:{}
                });
            }
        })
    }
    else
    res.status(400).json({
        status:400, 
        success:false, 
        message:"Incorrect old password",
        data:{}
    });
});

//----------------------------------------------------------

//-------------------Winner List API------------------------

const sortSchema = new mongoose.Schema({
    _id: Number,
    userId: {
      type: mongoose.Schema.Types.Number,
      ref: "Signup",
    },
    contestId: Number,
    contestTime: Number,
    correctAnswer: Number,
    answerTime: SchemaTypes.Double,
    firstName: String,
    date: Number,
  });
  var Sorting = mongoose.model("sorting", sortSchema, "resultData");

function getWinnerList(contestSlot, startDateFormated, endDateFormated) {
    return new Promise((resolve) => {
      let startDate = +new Date(
        startDateFormated
      );
      let endDate = +new Date(endDateFormated);

        Sorting.find({
            correctAnswer: 5,
            contestTime: { $gte: startDate, $lte: endDate },
            contestId: contestSlot,
        })
        .populate({ path: "userId", select: "firstName lastName image" })
        .sort({ answerTime: 1 })
        .limit(3)
        .exec(function (err, winner) {
         
          if (err) {
            console.log("Hey, i am in error-->", err);
            return resolve([]);
          }
          const obj = JSON.parse(JSON.stringify(winner));
          var result = [];
          for (var i = 0; i <= winner.length - 1; i++) {
            var conversionToHours = new Date(obj[i].contestTime);
            var date = conversionToHours.toLocaleDateString("en-GB");
           
            var objs = {
              _id: obj[i].userId._id,
              firstName: obj[i].userId.firstName,
              lastName: obj[i].userId.lastName,
              image: obj[i].userId.image,
              contestTime: obj[i].contestTime,
              contestId: obj[i].contestId,
              answerTime: obj[i].answerTime,
              date: date,
            };
            result.push(objs);
            
          }
          return resolve(result);
        });
    });
}

app.get("/v1/winnerlist",verifyAccessToken, async (req, res) => {
    if(req.headers['authorization']!== null) {
        var finalWinnerList = [];
        for (let i = 0; i < 15; i++) {
        let startDate = moment().format("YYYY-MM-DD 00:00:00"),
            endDate = moment().format("YYYY-MM-DD 23:59:59");
        if (i > 0) {
            startDate = moment().subtract(i, 'days').format("YYYY-MM-DD 00:00:00");
            endDate = moment().subtract(i, 'days').format("YYYY-MM-DD 23:59:59");
        }
        let [data1, data2, data3, data4, data5] = await Promise.all([
            getWinnerList(10, startDate, endDate),
            getWinnerList(12, startDate, endDate),
            getWinnerList(2, startDate, endDate),
            getWinnerList(4, startDate, endDate),
            getWinnerList(7, startDate, endDate)])
        finalWinnerList = [...finalWinnerList, ...data1, ...data2, ...data3, ...data4, ...data5]
        }
        if(finalWinnerList == null) {
            res.status(400).json({
                status:400, 
                success:false, 
                message:"No winner list data",
                data:{}
            });    
        }
        else res.status(200).json({
            status:200, 
            success:true, 
            message:"Winner list data",
            data:finalWinnerList
        });

        const countOfElements = collect(finalWinnerList);
        const total = countOfElements.count();
        console.log("the no.of element are----->" + total);

        if (total == 225){
        Sorting.db.dropCollection(('contest'),(collection)=>{
            console.log("Collection is deleted!");
        });
        }
    }
    else
    res.status(400).json({
        status:400, 
        success:false, 
        message:"No winner list data",
        data:{}
    });
});
//-------------------------------------------------------------

//----------------------Play once API----------------------

const playerSchema = new mongoose.Schema({
    _id: Number,
    contestSlot: Number,
    contestDate : Number
})

const myModel = mongoose.model("myModel", playerSchema, "newplayerId")

app.post("/v1/recheck", (req, res) => {
    let startDate = moment(req.body.contestDate).format("YYYY-MM-DD 00:00:00");
    endDate = moment().format("YYYY-MM-DD 23:59:59");
    Result.find({
        contestId: req.body.contestSlot,
        userId: req.body._id,
        contestTime: { $gte: + new Date(startDate), $lte: + new Date(endDate) },
    })
        .exec((err,resultData) => {
            console.log("resultData------->", resultData);
            if(err){
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message:"Bad Request",
                    data:{}
                })
            }
            if (resultData && resultData.length > 0) {
                return res.status(400).json({
                    status:400,
                    success: true,
                    message:"Please wait for the upcoming contest.",
                    data:{}
                })

            } else {
                return res.status(200).json({
                    status:200,
                    success: true,
                    message:"Player hasn't played the game. Please show the questions.",
                    data:{}
                })
            }
        })
})

//------------------------------------------------------

//----------------------Game Rules----------------------

const rulesSchema = new mongoose.Schema({
    _id : Number,
    rule : String
});
const GameRules = mongoose.model("gameRules", rulesSchema, "rules");

app.get("/v1/rules", (req,res)=>{
    
    GameRules.find({}, function(err, result){
        if (err) res.status(400).json({
            status:400,
            success:false,
            message:"Error in displaying rules",
            data:{}
        });
        else res.status(200).json({
            status:200,
            success:true,
            message:"Game Rules",
            data:result
        });
    })
})

//------------------------------------------------------

//-----------------Terms and Conditions-----------------

const tncSchema = new mongoose.Schema({
    _id : Number,
    tnc : String
});

const TermsNCondition = mongoose.model("TermsNCondition", tncSchema, "tnc");

app.get("/v1/tnc", (req,res)=>{
    
    TermsNCondition.find({}, function(err, result){
        if (err) res.status(400).json({
            status:400,
            success:false,
            message:"Error in displaying terms and conditions ",
            data:{}
        });
        else res.status(200).json({
            status:200,
            success:true,
            message:"Terms and Conditions",
            data:result
        });
    })
})

app.listen(PORT,ip, (error) => {
    if(error) throw error;
    console.log("Server listening on 192.168.1.67:%s ", PORT);
});

