const express = require('express');
const app = express();
const PORT = 5000;
const http = require('http');


const AuthServer = {
    address: 'localhost',
    port: 4000
};

//Cached Token to reduce the workload of Authentication server.
const Tokens = {

    'gao.yana@husky.neu.edu': {
        token: "1234abcd",
        tokenLife: ""
    }

};
//@todo 应该是谁和谁的聊天！
const Messages = [
    {
        sender: "Amit",
        text: "Hello guys",
        timestamp: new Date().toString()
    },
    {
        sender: "Bao",
        text: "How are you doing?",
        timestamp: new Date().toString()
    }
];

app.get('/messagelist', (req, res) => {


    console.log(req.headers);

    const requestUser = req.headers.User;
    const requestToken = req.headers.Token;
    const currentChatWith = req.headers.ChatWith;


    if (!requestToken || !requestUser || !currentChatWith) {
        res.status(400).json('bad request!');
    }
    if (Tokens[requestUser].token === requestToken && Tokens[requestUser].tokenLife >= new Date()) {
        res.setHeader({'Access-Control-Allow-Origin': '*'});
        res.status(200).json(Messages);//@todo !
    } else {
        VerifyToken(requestToken, requestUser, res);
    }
});

//
// function verify(token, user){
//
//
//     const client = new XMLHttpRequest();
//     client.open('GET','/verifytoken',false);
//     client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//
//
//
// }



 function VerifyToken(token, user, responseToUser) {

    console.log("进入");

    const options = {
        hostname: AuthServer.address,
        port: AuthServer.port,
        path: '/verifytoken',
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
            'token': token,
            'user': user
        }
    };
    const req = http.request(options, (res) => {

        res.setEncoding('utf8');
        if (res.statusCode >= 200 && res.statusCode < 300) {
            let output = '';
            res.on('data', (chunk) => {
                output += chunk;
            });
            res.on('end', () => {
                let tokenLife = new Date(output);
                console.log(tokenLife);
                Tokens[user].token = token;
                Tokens[user].tokenLife = tokenLife;
                console.log(Tokens);
                responseToUser.status(200).json(Messages);
            });
        } else {
            responseToUser.status(401).json('Token invalid!');
        }
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
    req.end();
}


//
// //POST
// let postData = JSON.stringify({email: "gao.yana@husky.neu.edu", password: "7NJvbMsbD6cFCCb"});
// const options = {
//     hostname: AuthServer.address,
//     port: AuthServer.port,
//     path: '/login',
//     method: 'POST',
//     headers: {
//         'content-type': 'application/json',
//         'accept': 'application/json'
//     }
// };
// const req = http.request(options, (res) => {
//     res.setEncoding('utf8');
//     res.on('data', (chunk) => {
//         console.log(`BODY: ${chunk}`);
//     });
//     res.on('end', () => {
//         console.log('No more data in response.');
//     });
// });
//
// req.on('error', (e) => {
//     console.error(`problem with request: ${e.message}`);
// });
// req.write(postData);
// req.end();


app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

