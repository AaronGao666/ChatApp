const express = require('express');
const app = express();
const PORT = 6000;
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

    if (req.headers.token === token) {
        res.status(200).json(Users);
    } else {
        res.status(401).json('Invalid Token!');
    }
});




app.get('/grouplist',(req, res)=>{
    if (req.headers.token === token) {
        res.status(200).json(Groups);
    } else {
        res.status(401).json('Invalid Token!');
    }
});



app.listen(PORT, () => console.log(`http://localhost:${PORT}`));