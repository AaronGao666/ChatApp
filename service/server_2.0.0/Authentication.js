const express = require('express');
const app = express();
const PORT = 4000;


const tokenLife = new Date();
tokenLife.setHours(tokenLife.getHours() + 1);

const Tokens = {
    'gao.yana@husky.neu.edu':{
        token: '1234abcd',
        tokenLife: tokenLife
    }
};

//@todo separate to dedicate servers
//Dummy messages

const Messages={

  "Amit":  [
      {
          sender: "Amit",
          text: "Hello guys",
          timestamp: new Date().toString()
      },
      {
          sender: "Amit",
          text: "How are you doing?",
          timestamp: new Date().toString()
      }
  ]


};


app.get('/messagelist', (req, res) => {


    const {user, token, chatwith} = req.headers;

    if (!user || !token || !chatwith) {
        res.status(400).json({err:"bad request!"});
    }else if (Tokens[user].token === token && Tokens[user].tokenLife >= new Date()) {
        res.status(200).json(Messages[chatwith]);//
    } else {
        res.status(401).json({err:"not authenticated!"});
    }
});



//@todo separate to dedicate servers
const Users = {
    Amit: "Amit",
    Bao: "Bao",
    Chloe: "Chloe"
};

const Groups={
    0: "Happy Family",
    1: "Kris wu fans",
};


app.get('/friendlist', (req, res) => {

    const {user, token} = req.headers;

    if (!user || !token) {
        res.status(400).json({err:"bad request!"});
    }else if (Tokens[user].token === token && Tokens[user].tokenLife >= new Date()) {
        res.status(200).json(Users);//
    } else {
        res.status(401).json({err:"not authenticated!"});
    }
});


app.get('/grouplist',(req, res)=>{

    const {user, token} = req.headers;

    if (!user || !token) {
        res.status(400).json({err:"bad request!"});
    }else if (Tokens[user].token === token && Tokens[user].tokenLife >= new Date()) {
        res.status(200).json(Groups);//
    } else {
        res.status(401).json({err:"not authenticated!"});
    }
});





//api for other servers to use.
app.get('/verifytoken',(req,res)=>{

    if(req.headers.token === Tokens[req.headers.user].token){
        res.status(200).json(Tokens[req.headers.user].tokenLife);
    } else {
        res.status(401).json('Invalid Token!');
    }
});



app.post('/register', express.json(), (req, res) => {
//@todo user input laundry.
    const {firstName, lastName, email, password} = req.body;
    if (Users[email]) {
        res.status(409).json({error: 'Email address already exists!'});
    } else if (firstName && lastName && email && password) {
        Users[email] = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Password: password
        };
        res.status(200).json(token);
    } else {
        res.status(400).json({error: 'All fields are required not to be null'});
    }

});

app.post('/login', express.json(), (req, res) => {

    const info = req.body;
    if (info.email === "gao.yana@husky.neu.edu" && info.password === "7NJvbMsbD6cFCCb") {
        res.status(200).json(Tokens[info.email]);
    } else {
        res.status(401).json({error: 'Incorrect password / username'});
    }

});

app.post('/logout', express.json(), (req, res) => {

    const useremail = req.body.email;
    if (useremail === 'gao.yana@husky.neu.edu') {
        res.sendStatus(200);
    } else {
        res.status(401).json({error: 'You are not allowed to logout give user'});
    }


});


app.listen(PORT, () => console.log(`http://localhost:${PORT}`));