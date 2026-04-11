//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming

import express from "express" ;
import { dirname } from "path"; 
import { fileURLToPath } from "url"; 
const __dirname = dirname(fileURLToPath(import.meta.url)); 
import bodyParser from "body-parser";

const port = 3000;
const app = express() ;

app.use(bodyParser.urlencoded({ extended:true })) ; 

var userAuth = false ; 


function passwordcheck(req, res , userAuth){
    password = req.body.password; 
    if (password == "ILoveProgramming"){
        var userAuth = true; 
    }else{
        res.send("Access Denied");
    }
    next();
}

app.user(passwordcheck); 

app.get("/" , (req, res) => {
    res.sendFile(__dirname + "/public/index.html"); 
}); 

app.post("/check", (req, res) => {
    if (userAuth){
        res.sendFile(__dirname + "/public/secret.html"); 
    }
}); 


app.listen(port , ()=> {
    console.log(`app is running on ${ port }`);
});