import express from "express" ; 

 const app = express() ; 


 app.get("/", (req, res) => {
    //console.log(req.rawHeaders);
    //console.log(req.headers);
    res.send("<h1>Hello World!</h1>");  
 }); 

 app.get("/about", (req, res) => {
    res.send("Hi my name is sukhdev pratap singh i am a student at mgahv");  
}); 

app.get("/contect",  (req, res) => {
    res.send("if you want to contect me just email me at sukhdevps04@gmail.com"); 
}); 

 app.listen(5000, () => {
    console.log("Server is running at http://localhost:5000"); 
 });