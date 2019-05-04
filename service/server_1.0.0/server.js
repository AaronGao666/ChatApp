const express = require('express');
const app = express();
const PORT = 4000;
const crypto = require('crypto');
const Tokens = {};
/**
 I'm a huge fan of regexes...but you should be careful about them. Also, the RegExp here is unneeded, since you use the regex constructor syntax (//) that is built in:

 re = /^[a-z]+/;
 re = new RegExp('^[a-z]+');

 You're creating it twice.
 */
const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

//3 dummy users already created.
const Users = {
    'maurice.bryant@test.com':
        {
            FirstName: 'Maurice',
            LastName: 'Bryant',
            Email: 'maurice.bryant@test.com',
            Password: {
                salt: '7911bc1401d50304',
                passwordHash:
                    'e2feb81bca786674e9cdd199d886e2b6619fa5facefffe8669ba2415a30bfeef382419cd9d1b4ec591ed2ec13a0470ad2559bc87d121066248a6ae238048b898'
            },
            Friends: {},
            Groups: {},
            FriendRequests: {}
        },
    'louise.ricks@test.com':
        {
            FirstName: 'Louise',
            LastName: 'Ricks',
            Email: 'louise.ricks@test.com',
            Password: {
                salt: '6e6c3b3302b00396',
                passwordHash:
                    'b58f294bab5d885614a50be2af217ccab7bfd8499b02dadcfaf26624d426804e007154947b1c3e25af19143a25eeb7ba589fdf87a2f491c4469aa4e3f9052904'
            },
            Friends: {},
            Groups: {},
            FriendRequests: {}
        },
    'bobby.brown@test.com':
        {
            FirstName: 'Bobby',
            LastName: 'Brown',
            Email: 'bobby.brown@test.com',
            Password: {
                salt: 'da532bb15725c2a9',
                passwordHash:
                    '462c47b55e2b29588bc5677f86c7ca86d9f5b3630f41c7ef6d18d0aed7f90396c8a201fc26d2cef7c1c72f7714e705dc08146917db703a7dcde0caaf156367dd'
            },
            Friends: {},
            Groups: {},
            FriendRequests: {}
        }
};


//5 dummy groups, no admins, no need approval
const Groups = {
    "HappyFamily": [],
    "NBA": [],
    "NEU": [],
    "Seattle":[],
    "Amazon":[]
};

const OnlineUsers = {};
//As previously noted, the upper-case-ness here does not make sense.
//manage the entire application's messages
const Messages = {};


function clearNonValidUsers() {
    Object.values(OnlineUsers).map((user) => {
        if (Tokens[user].tokenLife < new Date()) {
            delete OnlineUsers[user];
        }
    });
}

//clear out invalid logged in users every one minute.
setInterval(clearNonValidUsers, 60000);

function GenerateToken(email) {
    const tokenLife = new Date();
    tokenLife.setMinutes(tokenLife.getMinutes() + 30); //by default the token's life is half hour
    Tokens[email] = {
        token: crypto.createHash('md5').update(email + tokenLife).digest('hex'),
        tokenLife: tokenLife
    }
}

//Why is this MixedCase instead of camelCase?
function GetMessages(user, target, type) {

    if (type === 'person') {
        if (user === target) {
            return [];
        } else {
            const id = user > target ? target + "-" + user : user + "-" + target;
            if (!Messages[id]) {
                Messages[id] = [];
            }
            return Messages[id]
        }
    } else {
        return Groups[target];
    }
}

function verifyToken(user, token) {
    return Tokens[user] && Tokens[user].token && Tokens[user].tokenLife && Tokens[user].token === token && Tokens[user].tokenLife >= new Date();
}


function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}


/**
 * Not a problem for this project, but I hope you understand that salting/hashing your own passwords is probably a bad idea. How did you make sure your process is cryptographically secure, and likely to remain so?
 * */
function hashPwd(password, salt) {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
}

app.get('/messagelist', (req, res) => {

    const {user, token, chatwith, type} = req.headers;
//Anyone consuming your service would be greatful if you say what is BAD about the bad request.
    if (!user || !token || !chatwith || !type) {
        res.status(400).json({err: "bad request!"});
    } else if (verifyToken(user, token)) {
        res.status(200).json(GetMessages(user, chatwith, type));//
    } else {
        res.status(401).json({err: "not authenticated!"});
    }
});


app.post('/messagelist', express.json(), (req, res) => {
    const {sender, text, chatwith, token, type} = req.body;

    if (!sender || !text || !chatwith || !token) {
        res.status(400).json({err: "bad request!"});
    } else if (verifyToken(sender, token)) {
        GetMessages(sender, chatwith, type).push({
            sender: Users[sender].FirstName + " " + Users[sender].LastName,
            text: text,
            timestamp: new Date()
        });
        res.sendStatus(200);
    } else {
        res.status(401).json({err: "not authenticated!"})
    }

});


app.get('/friendlist', (req, res) => {

    const {user, token} = req.headers;
    if (!user || !token) {
        res.status(400).json({err: "bad request!"});
    } else if (verifyToken(user, token)) {
        res.status(200).json(Users[user].Friends);
    } else {
        res.status(401).json({err: "not authenticated!"});
    }
});


app.get('/grouplist', (req, res) => {

    const {user, token} = req.headers;

    if (!user || !token) {
        res.status(400).json({err: "bad request!"});
    } else if (verifyToken(user, token)) {
        res.status(200).json(Users[user].Groups);//
    } else {
        res.status(401).json({err: "not authenticated!"});
    }
});

//This is not a RESTful api. POST says it's adding. It's not adding to 'addfriend', it's adding to 'friendlist' (or something else, but not 'addfriend')
app.post('/addfriend', express.json(), (req, res) => {
    const {sender, target, token} = req.body;

    if (!sender || !target || !token) {
        res.status(400).json({error: 'bad request!'});
    } else if (!Users[target]) {
        res.status(404).json({error: 'user does not exists!'});
    } else if (verifyToken(sender, token)) {
        Users[target].FriendRequests[sender] = {
            email: sender,
            name: Users[sender].FirstName + " " + Users[sender].LastName
        };
        res.sendStatus(200);
    } else {
        res.status(401).json({error: 'not authorized!'});
    }
});


app.get('/friendrequests', (req, res) => {
    const {user, token} = req.headers;

    if (!user || !token) {
        res.status(400).json({err: "bad request!"});
    } else if (verifyToken(user, token)) {
        res.status(200).json(Users[user].FriendRequests);//
    } else {
        res.status(401).json({err: "not authenticated!"});
    }
});

//Also not RESTful. You aren't having the URL be the resource, you're having the URL be the intent.
app.put('/acceptrequest', (req, res) => {

    const {user, token, requester} = req.headers;
    if (!user || !token || !requester) {
        res.status(400).json({err: "bad request!"});
    } else if (verifyToken(user, token)) {
        Users[requester].Friends[user] = {
            email: user,
            name: Users[user].FirstName + " " + Users[user].LastName
        };
        Users[user].Friends[requester] = {
            email: requester,
            name: Users[requester].FirstName + " " + Users[requester].LastName
        };
        delete Users[user].FriendRequests[requester];
        res.sendStatus(200);
    } else {
        res.status(401).json({err: "not authenticated!"});
    }
});
/**
 See how the verbage gets confusing here? You're 'delete'ing 'declinerequest'. What happens if you POST to /declinerequest? Does deleting it mean you are stopping declining?
 It's a bit subjective, but I'd POST/DELETE to /friendlist/request to accept/decline
 * */
app.delete('/declinerequest', (req, res) => {
    const {user, token, requester} = req.headers;

    if (!user || !token || !requester) {
        res.status(400).json({err: "bad request!"});
    } else if (verifyToken(user, token)) {
        delete Users[user].FriendRequests[requester];
        res.sendStatus(200);
    } else {
        res.status(401).json({err: "not authenticated!"});
    }
});


app.post('/joingroup', express.json(), (req, res) => {
    const {sender, target, token} = req.body;

    if (!sender || !target || !token) {
        res.status(400).json({error: 'bad request!'});
    } else if (!Groups[target]) {
        res.status(404).json({error: 'group does not exists!'});
    } else if (verifyToken(sender, token)) {
        Users[sender].Groups[target] = target;
        res.sendStatus(200);
    } else {
        res.status(401).json({error: 'not authorized!'});
    }
});


app.post('/register', express.json(), (req, res) => {

    let {firstName, lastName, email, password} = req.body;
    if (!firstName || !lastName || !email || !password) {
        res.status(400).json({error: "bad request!"});
    } else if (firstName.length < 3 || firstName.length > 100 || lastName.length < 3 || lastName.length > 100 || email.length < 3 || email.length > 100 || password.length < 6 || password.length > 100 || !emailRegex.test(email)) {
        res.status(406).json({error: "not acceptable!"});
    } else {
        email = email.toLowerCase();
        if (Users[email]) {
            res.status(409).json({error: 'Email address already exists!'});
        } else {
            Users[email] = {
                FirstName: firstName,
                LastName: lastName,
                Email: email,
                Password: hashPwd(password, genRandomString(16)),
                Friends: {},
                Groups: {},
                FriendRequests: {}
            };
            GenerateToken(email);
            OnlineUsers[email] = email;
            res.status(200).json({
                token: Tokens[email],
                name: firstName + lastName,
                email: email
            });
        }
    }
});

app.post('/login', express.json(), (req, res) => {

    let {email, password} = req.body;
    if (!email || !password) {
        res.status(400).json({error: "bad request!"});
    } else if (email.length < 3 || email.length > 100 || password.length < 6 || password.length > 100 || !emailRegex.test(email)) {
        res.status(406).json({error: "not acceptable!"});
    } else {
        email = email.toLowerCase();
        if (!Users[email]) {
            res.status(404).json({error: 'user does not exists!'})
        } else if (OnlineUsers[email]) {
            res.status(409).json({error: 'user already logged in!'})
        } else if (Users[email].Password.passwordHash === hashPwd(password, Users[email].Password.salt).passwordHash) {
            GenerateToken(email);
            OnlineUsers[email] = email;
            res.status(200).json({
                token: Tokens[email],
                name: Users[email].FirstName + Users[email].LastName,
                email: email
            });
        } else {
            res.status(401).json({error: 'Incorrect password / username'});
        }
    }

});

app.post('/logout', express.json(), (req, res) => {

    let {email, token} = req.body;
    if (!email || !token) {
        res.status(400).json({error: "bad request!"});
    } else {
        email = email.toLowerCase();
        if (!OnlineUsers[email]) {
            res.status(404).json({error: 'user not logged in'});
        } else if (verifyToken(email, token)) {
            delete Tokens[email];
            delete OnlineUsers[email];
            res.sendStatus(200);
        } else {
            res.status(401).json({error: 'You are not allowed to logout given user'});
        }
    }

});


app.listen(PORT, () => console.log(`http://localhost:${PORT}`));