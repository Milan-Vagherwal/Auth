const express = require("express");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "harkirat123";

const app = express();
app.use(express.json());

const users = [];
function logger(req, res, next) {
    console.log(`${req.method} request is called`);
    next();
}

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
})
app.post("/signup",logger , function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    users.push({
        username : username,
        password : password
    })
    // we should check if a user with username shouldn't already exist
    res.json({
        message: "you are signed up"
    })
})
app.post("/signin",logger,  function(req, res){
    const username = req.body.username
    const password = req.body.password

    let foundUser = null;

    for(let i =0; i < users.length; i++) {
        if(users[i].username === username && users[i].password === password) {
            foundUser = users[i]
        }
    }

    if (!foundUser) {
        res.json({
            message: "Credentials incorrect"
        })
        return
    } else{
        const token = jwt.sign({username: foundUser.username}, JWT_SECRET)
        // res.header("jwt",token);

        res.json({
            token : token
        })
    }
})
function auth(req, res, next) {
    const token = req.headers.token;
    if(!token){
        return res.status(401).json({message: "No token provided"})
    }
    const decodedData = jwt.verify(token, JWT_SECRET);

    if (decodedData.username){
        req.username = decodedData.username
        next()
    }
    else{
        res.json({
            message: "you are not logged in"
        })
    }
}
app.get("/me", auth, logger , function(req, res){
    // const token = req.headers.token;
    // const decodedData = jwt.decode(token);
    // const decodedData = jwt.verify(token, JWT_SECRET);
    
        let foundUser = null;

        for(let i = 0 ; i<users.length; i++) {
            if(users[i].username === req.username){
                foundUser = users[i];
            }
        }
        res.json({
            username : foundUser.username,
            password : foundUser.password
        })
        console.log(users);
})
app.listen(3000);