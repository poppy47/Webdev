import express from "express"; 
const app = express(); 

app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>")
}); 

app.post("/register", (req, res) => {
    res.sendStatus(201); 
});

app.put("/user/angela", (req, res) => {
    res.sendStatus(200); 
});

app.patch("/user/angela", (req, res) => {
    res.sendStatus(200); 
}); 


app.delete("/user/angela", (req, res) => {
    res.sendStatus(200);
}); 

app.listen(3000, ()=> {
    console.log("app is running at the port 3000"); 
}); 