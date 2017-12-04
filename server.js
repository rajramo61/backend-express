let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let jwt = require('jwt-simple');
let bcrypt = require('bcrypt-nodejs');
let app = express();
let User = require('./models/Users');

mongoose.Promise = Promise;

let posts = [
        {message: "Hello"},
        {message: "hi"}
    ];

app.use(cors());
app.use(bodyParser.json());

app.get('/posts', (req, res) => {
    res.status(200).send(posts);
});

app.get('/users', async (req, res) => {

    try{
        let users = await User.find({}, '-password -__v');
        res.status(200).send(users);
    }catch(error){
        res.status(500).send({message: "Error in fetching users details."});
    }
});

app.get('/profile/:id', async (req, res) => {
        console.log("User id from request = %s", req.params.id);
        try{
            let user = await User.findById(req.params.id, '-password -__v');
            res.status(200).send(user);
        }catch(error){
            res.status(500).send({message: "Error in fetching user details with id = " + req.param.id});
        }
    });

app.post('/register', (req, res) => {
    let userData = req.body;
    console.log("Input Email : %s", userData.email);
    console.log("Input Password : %s", userData.password);

    let user = new User(userData);
    user.save((error, result) => {
        if(error){
            console.log("Error while saving the user %o", error);
            res.status(500);
        }else{
            //console.log(result);
            res.status(200);
            console.log("User data saved successfully");
        }
    });
});

app.post('/login', async (req, res) => {
    let loginData = req.body;
    console.log("Input Email : %s", loginData.email);
    console.log("Input Password : %s", loginData.password);

    let user = await User.findOne({email: loginData.email});
    console.log("User info : %o", user);
    if(!user){
        return res.status(401).send({massge: "Email or Password invalid."});
    }
    bcrypt.compare(loginData.password, user.password, (error, isMatch) => {
        if(!isMatch){
            return res.status(401).send({massge: "Email or Password invalid."});
        }
        let payload = {};
        let token = jwt.encode(payload, 'secret123$');
        res.status(200).send({token});
    });
    
});

mongoose.connect('mongodb://<user>:<password>@ds129066.mlab.com:29066/mean-social', {useMongoClient: true,},
    (error) => {
    if(!error){
        console.log('connected to MongoDB');
    }
});

app.listen(3000);